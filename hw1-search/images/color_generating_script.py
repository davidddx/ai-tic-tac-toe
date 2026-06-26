# Script to generate images
# of different colors for 
# tic tac toe sprites &
# 8-puzzle sprites

from PIL import Image
import os
def convertImageToColor(image_path: str, rgb_color_original: tuple[int, int, int], rgb_color_final: tuple[int, int, int], save_path: str):
    image = Image.open(image_path)
    pixelData = image.load()
    for i in range(image.size[0]):
        for j in range(image.size[1]):
            #print(pixelData[i,j])
            if rgb_color_original != pixelData[i, j]:
                continue
            pixelData[i, j] = rgb_color_final
    image.save(fp=save_path)

if __name__ == "__main__":
    # for numbers
    pngs_in_dir = os.listdir('./black')
    pngs_in_dir = [x for x in pngs_in_dir if len(x) > 4 and x[-4:] == ".png"]
    pngs_path = ['./black/' + x for x in pngs_in_dir]
    original_rgb = (0,0,0,255)
    color_to_rgb = {
        "red": (255, 0, 0, 255),
        "green": (0, 255, 0, 255),
        "blue": (0, 0, 255, 255),
        "yellow": (255, 255, 0, 255),
        "purple": (255, 0, 255, 255),
        "cyan": (0, 255, 255, 255)
    }
    for png, path in zip(pngs_in_dir, pngs_path):
        for color_name, color_rgb in color_to_rgb.items():
            new_path = f'./{color_name}/{png}'
            try: os.mkdir(color_name)
            except FileExistsError as e:
                pass
            convertImageToColor(path, original_rgb, color_rgb, new_path)

    # for tic tac toe
    pngs_in_dir = os.listdir('./x_tic_tac_toe/black')
    pngs_in_dir = [x for x in pngs_in_dir if len(x) > 4 and x[-4:] == ".png"]
    pngs_path = ['./x_tic_tac_toe/black/' + x for x in pngs_in_dir]
    original_rgb = (0,0,0,255)
    color_to_rgb = {
        "red": (255, 0, 0, 255),
        "green": (0, 255, 0, 255),
        "blue": (0, 0, 255, 255),
        "yellow": (255, 255, 0, 255),
        "purple": (255, 0, 255, 255),
        "cyan": (0, 255, 255, 255)
    }
    for png, path in zip(pngs_in_dir, pngs_path):
        for color_name, color_rgb in color_to_rgb.items():
            new_path = f'./x_tic_tac_toe/{color_name}/{png}'
            try:
                os.mkdir(new_path.rsplit('/', maxsplit=1)[0])
            except FileExistsError as e:
                raise e
            convertImageToColor(path, original_rgb, color_rgb, new_path)
    pngs_in_dir = os.listdir('./o_tic_tac_toe/black')
    pngs_in_dir = [x for x in pngs_in_dir if len(x) > 4 and x[-4:] == ".png"]
    pngs_path = ['./o_tic_tac_toe/black/' + x for x in pngs_in_dir]
    for png, path in zip(pngs_in_dir, pngs_path):
        for color_name, color_rgb in color_to_rgb.items():
            new_path = f'./o_tic_tac_toe/{color_name}/{png}'
            try:
                os.mkdir(new_path.rsplit('/', maxsplit=1)[0])
            except FileExistsError as e:
                pass
            convertImageToColor(path, original_rgb, color_rgb, new_path)

