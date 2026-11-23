from pathlib import Path
from PIL import Image
root=Path(__file__).resolve().parent
(root/'assets').mkdir(exist_ok=True)
boxes={'conditions':(40,378,740,1490),'review':(40,62,740,1290),'published':(40,160,740,1450),'apartment':(0,0,780,1688),'bid':(40,220,740,1470),'pending':(40,220,740,1470),'accepted':(40,220,740,1130)}
for i in range(1,9): boxes[f'type-{i}']=boxes['bid']
for name,box in boxes.items(): Image.open(root/'screens'/f'{name}.png').crop(box).save(root/'assets'/f'{name}.png')
