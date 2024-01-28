CAMERA_SOURCE = 1

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
from ultralytics import YOLO
import torch
import time
import requests

import os
os.environ['KIVY_GL_BACKEND'] = 'angle_sdl2' #Required for Nvidia GPU

kv_file = Path(__file__).resolve().parent / "mykv.kv"
Builder.load_file(str(kv_file))

cap = cv2.VideoCapture(CAMERA_SOURCE)
model = YOLO('C:\\Users\\oluwa\\Desktop\\Coding\\hackathons\\tamu\\computerVision\\training\datasets\\runs\detect\\train8\weights\\best.pt')
class_labels =  ['bag', 'bottle', 'card', 'charger', 'clothes', 'glasses', 'hat', 'headphone', 'key', 'laptop', 'nothing', 'phone', 'wallet', 'watch']
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
        self.zones_colors = [sv.Color.RED, sv.Color.BLACK, sv.Color.BLUE, sv.Color.YELLOW]
        self.image_path = './temp/cameraTester.png'
        self.last_elapsed_time = time.time()

    def reset_zone(self):
        self.zones = [None, None, None, None]

    def set_zone(self, zone):
        #Make the cursor popup open
        coords = []

        def on_position_received(x, y):
            coords.append([x, y])
            #Draw the dot on the image
            frame = cv2.imread(self.image_path)
            for i in range(len(coords)):
                x, y = coords[i]
                cv2.circle(frame, (int(x * frame.shape[1]), int(y * frame.shape[0])), 5, self.zones_colors[zone].as_bgr(), -1)
            cv2.imwrite(self.image_path, frame)
            cursor_popup.image_reload()
            
            if len(coords) == int(self.ids.points.text):
                self.zones[zone] = coords
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
                cv2.polylines(frame, [zone], True, self.zones_colors[i].as_bgr(), 2)
        return frame

    def send_data(self, items_in_zone):
        if len(items_in_zone) == 0:
            return
        url = "https://testing.rondevu.app/flight/items"

        json_data = {
            "data": [
            {
                "zone": 35 + i,
                "items": items
            } for i, items in enumerate(items_in_zone)
        ]
        }
        response = requests.post(url, json=json_data)

        if response.status_code == 200:
            print("Request was successful")
            print("Response content:", response.json())
        else:
            print(f"Request failed with status code: {response.status_code}")

        


    def model_inference(self, frame):
        #Change the zones to np.int32
        polygons = []
        for i in range(len(self.zones)):
            if self.zones[i] is not None:
                zone = np.array(self.zones[i])
                zone[:, 0] *= frame.shape[1]  # Multiply x-coordinates by image width
                zone[:, 1] *= frame.shape[0]  # Multiply y-coordinates by image height
                zone = zone.astype(np.int32)  # Convert coordinates to integers
                polygons.append(zone)
        if len(polygons) <= 0:
            return frame
        zones = [
            sv.PolygonZone(
                polygon=polygon, 
                frame_resolution_wh= [frame.shape[1], frame.shape[0]]
            )
            for polygon
            in polygons
        ]
        zone_annotators = [
            sv.PolygonZoneAnnotator(
                zone=zone, 
                color=self.zones_colors[index],
                thickness=0,
                text_scale=0
            )
            for index, zone
            in enumerate(zones)
        ]

        label_annotator = [
            sv.LabelAnnotator(
                text_position=sv.Position.CENTER,
                color=self.zones_colors[index], 
                # thickness=4, 
                # text_thickness=4, 
                # text_scale=2
            )
            for index
            in range(len(polygons))
        ]

        results = model(frame, imgsz = 640)[0]
        detections = sv.Detections.from_ultralytics(results)
        detections = detections[(detections.confidence > 0.3)]

        items_in_zone = []

        for zone, zone_annotator, label_annotator in zip(zones, zone_annotators, label_annotator):
            mask = zone.trigger(detections=detections)
            
            frame = zone_annotator.annotate(
                scene=frame, 
                label=""
                )
            
            detections_filtered = detections[mask]

            current_label = [class_labels[class_id] for class_id in detections_filtered.class_id]

            items_in_zone.append(current_label)

            frame = label_annotator.annotate(scene=frame, 
                                             detections=detections_filtered,
                                             labels = current_label
                                             )
        if time.time() - self.last_elapsed_time >= 2.0:
            self.last_elapsed_time = time.time()
            self.send_data(items_in_zone)

            
        
        return frame
        


        


    def main_process(self, dt):
        ret, frame = cap.read()
        if ret:
            frame = cv2.resize(frame, (640,480))
            frame = self.model_inference(frame)
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