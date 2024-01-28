import cv2

def camera_tester():
    # Open the default camera
    cap = cv2.VideoCapture(0)

    while True:
        # Read the current frame from the camera
        ret, frame = cap.read()

        if ret:
            # Display the frame
            cv2.imshow('Camera Tester', frame)

            #Save the frame as a png file
            cv2.imwrite('./cameraTester.png', frame)

        # Exit the loop if 'q' is pressed
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    # Release the camera and close the window
    cap.release()
    cv2.destroyAllWindows()

# Run the camera tester
camera_tester()
