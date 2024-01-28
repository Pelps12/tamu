import cv2
import numpy as np

def get_user_marker_coordinate(image_path):
    # Load the image
    image = cv2.imread(image_path)

    # Show the image
    cv2.imshow('Image', image)

    markers = []

    def mouse_callback(event, x, y, flags, params):
        # Check if the left mouse button is pressed
        if event == cv2.EVENT_LBUTTONDOWN:
            # Draw a dot where the user clicked
            cv2.circle(image, (x, y), 5, (0, 0, 255), -1)
            # Add the coordinates to the list
            markers.append((x, y))

    # Set the callback function for any mouse event
    cv2.setMouseCallback('Image', mouse_callback)

    # Wait for the user to press 'q' to exit
    cv2.waitKey(0)

    # Close all windows
    cv2.destroyAllWindows()

    return markers

def watershed_segmentation(image_path, user_markers):
    # Read the image
    image = cv2.imread(image_path)
    
    # Convert the image to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Blur the image to reduce noise
    blurred = cv2.medianBlur(gray, 5)
    
    # Apply adaptive thresholding to create a binary image
    _, thresh = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    
    # Display the binary image
    cv2.imshow("Binary Image", thresh)
    
    # Create a marker image with the user-selected points
    markers = np.zeros_like(gray, dtype=np.int32)
    for marker in user_markers:
        markers[marker[1], marker[0]] = 1  # Set the marker at user-selected points
    
    # Apply the Watershed algorithm
    cv2.watershed(image, markers)
    
    # Create a mask based on the markers
    mask = np.zeros_like(image, dtype=np.uint8)
    mask[markers == -1] = [0, 0, 255]  # Mark watershed boundaries in red
    
    # Display the result
    cv2.imshow("Segmentation Result", cv2.addWeighted(image, 0.7, mask, 0.3, 0))
    
    cv2.waitKey(0)
    cv2.destroyAllWindows()

if __name__ == "__main__":
    image_path = "cameraTester.png"  # Replace with the path to your image
    user_markers = get_user_marker_coordinate(image_path)
    watershed_segmentation(image_path, user_markers)