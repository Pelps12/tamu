import os
import shutil

images_folder = "./datasets/train/images"
labels_folder = "./datasets/train/labels"


# Iterate over the files in the images folder

for filename in os.listdir(images_folder):
    labels_filename = filename.replace('.jpg', '.txt')
    label_path = os.path.join(labels_folder, labels_filename)
    image_path = os.path.join(images_folder, filename)
    for i in range(1, 4):
        new_image_filename = f"{filename.replace('.jpg', '')}_{i}.jpg"
        new_label_filename = f"{filename.replace('.jpg', '')}_{i}.txt"

        new_image_path = os.path.join(images_folder, new_image_filename)
        new_label_path = os.path.join(labels_folder, new_label_filename)

        # Copy the files
        shutil.copy2(image_path, new_image_path)
        shutil.copy2(label_path, new_label_path)