import cv2
import os
import datetime

class CameraApp:
    def __init__(self, save_path='captured_images/'):
        self.save_path = save_path
        self.capture = cv2.VideoCapture(2)

        # Create the save path if it doesn't exist
        if not os.path.exists(self.save_path):
            os.makedirs(self.save_path)

        self.image_counter = 1  # Counter for naming images

    def capture_image(self):
        ret, frame = self.capture.read()
        return frame

    def save_image(self, image):
        timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
        filename = os.path.join(self.save_path, f'captured_image_{timestamp}.png')
        cv2.imwrite(filename, image)
        print(f"Image saved at {filename}")

    def run(self):
        while True:
            frame = self.capture_image()

            # Display the captured frame
            cv2.imshow('Camera App', frame)

            # Check for key press
            key = cv2.waitKey(1) & 0xFF

            # Press 's' to save the image
            if key == ord('s'):
                self.save_image(frame)
                self.image_counter += 1

            # Press 'q' to exit the app
            elif key == ord('q'):
                break

        # Release the camera and close the OpenCV window
        self.capture.release()
        cv2.destroyAllWindows()

if __name__ == "__main__":
    app = CameraApp()
    app.run()
