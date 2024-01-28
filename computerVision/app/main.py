CAMERA_SOURCE = 0

from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.lang import Builder
from kivy.uix.popup import Popup
from kivy.uix.image import Image
from kivy.clock import Clock
import cv2
import os
from pathlib import Path
import supervision as sv
import numpy as np

kv_file = Path(__file__).resolve().parent / "mykv.kv"
Builder.load_file(str(kv_file))

cap = cv2.VideoCapture(CAMERA_SOURCE)

class CursorPopup(Popup):
    def __init__(self, image_path, callback, **kwargs):
        super().__init__(**kwargs)
        self.auto_dismiss = False

        self.image = Image(source=image_path, fit_mode="fill")
        self.add_widget(self.image)

        self.size_hint = (None, None)
        self.size = (self.image.texture_size[0], self.image.texture_size[1])

        self.callback = callback  # Callback function to pass the touch position

        # Bind image size and position to the widget's size and position
        self.bind(size=self.on_size, pos=self.on_pos)
        #Reload the image
        self.image.reload()
    
    def image_reload(self):
        self.image.reload()

    def on_size(self, instance, value):
        # Update the image size to match the widget's size
        self.image.size = value
        self.image.pos = self.pos

    def on_pos(self, instance, value):
        # Update the image position to match the widget's position
        self.image.pos = value

    def on_touch_down(self, touch):
        if self.image.collide_point(*touch.pos):
            # Calculate touch position relative to the image
            touch_x = touch.pos[0] - self.image.x
            touch_y = self.image.height - (touch.pos[1] - self.image.y)

            # Pass touch position to the callback function in MainLayout
            self.callback(touch_x / self.image.width, touch_y / self.image.height)

class MainLayout(BoxLayout):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.title = "Computer Vision"
        self.zones = [
            #np.array([[0, 0], [100, 0], [100, 100], [0, 100]]),  # Sample square zone
            None, None, None, None
        ]
        self.zones_colors = [(0, 0, 255), (0, 255, 0), (255, 0, 0), (255, 255, 0)]
        self.image_path = './temp/cameraTester.png'

    def set_zone(self, zone):
        #Make the cursor popup open
        coords = []

        def on_position_received(x, y):
            coords.append([x, y])
            #Draw the dot on the image
            frame = cv2.imread(self.image_path)
            for i in range(len(coords)):
                x, y = coords[i]
                cv2.circle(frame, (int(x * frame.shape[1]), int(y * frame.shape[0])), 5, self.zones_colors[zone], -1)
            cv2.imwrite(self.image_path, frame)
            cursor_popup.image_reload()
            
            if len(coords) == int(self.ids.points.text):
                self.zones[zone] = np.array(coords)
                cursor_popup.dismiss()
                #Enable the mainlayout's all touch events
                #Wait for 1 second to prevent the cursor popup from being opened again
                Clock.schedule_once(lambda dt: setattr(self, 'disabled', False), 1)

                

        cursor_popup = CursorPopup(
            image_path=self.image_path,
            callback=on_position_received,
            title="Cursor",
        )

        cursor_popup.open()
        #Disable the mainlayout's all touch events
        self.disabled = True
        

    def draw_zone(self, frame):
        # Draw the zone on the frame
        
        for i in range(len(self.zones)):
            if self.zones[i] is not None:
                zone = np.array(self.zones[i])
                zone[:, 0] *= frame.shape[1]  # Multiply x-coordinates by image width
                zone[:, 1] *= frame.shape[0]  # Multiply y-coordinates by image height
                zone = zone.astype(np.int32)  # Convert coordinates to integers
                cv2.polylines(frame, [zone], True, self.zones_colors[i], 2)
        return frame

    def main_process(self, dt):
        ret, frame = cap.read()
        if ret:
            frame = self.draw_zone(frame)

            cv2.imwrite(self.image_path, frame)
            self.ids.display.source = self.image_path
            self.ids.display.reload()
        


class MyApp(App):
    def build(self):
        try:
            os.mkdir("temp")
        except:
            pass

        main_layout = MainLayout()
        #Set title of the app
        self.title = main_layout.title

        Clock.schedule_interval(main_layout.main_process, 1.0 / 30.0)

        return main_layout


if __name__ == "__main__":
    MyApp().run()