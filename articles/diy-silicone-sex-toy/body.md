
After opening Blender, first press shortcut A to select all items, including the default cube, and then delete them all with the Delete key.

Then add Spheres and Cylinders, and press N to display the Transform panel to precisely set the coordinates and size of the selected object.
(The unit is not important and can be specified when the final export is made.)

Moving the position is more easily done by using the G shortcut, then entering X Y or Z letters, and then using the keyboard to enter numbers for precise movement.  
(When entering X Y Z letters, you can use the Shift key, for example, Shift + Z to select the XY plane.)  
(Similar to the G shortcut, S is to change the size and R or double R is to rotate.)

<img src="pic1/1.jpg" style="max-width:100%">

The desired shape has been assembled below and you can switch to the Wireframe view at any time to see the hidden details with the Z shortcut.  
(In the edit mode mentioned later, you can also switch to Wireframe view in order to select targets that are not visible from the current point of view.)

<img src="pic1/_1.jpg" style="max-width:100%">

<img src="pic1/_2.jpg" style="max-width:100%">

Next we add a bevel to the base. First select the base, then switch to edit mode by the Tab key.  
Hold down Ctrl + Alt and left-click to select the circle in the figure:

<img src="pic1/_3.jpg" style="max-width:100%">

Then use the Inset shortcut I to create a new small circle:

<img src="pic1/_4.jpg" style="max-width:100%">

Finally, you can move the original circle downward, using the G shortcut and then the letter Z to limit the direction of movement:

<img src="pic1/_5.jpg" style="max-width:100%">

There are many editing methods, the above is just one of them.  
In fact, the easiest way is to select the circle and create a bevel directly via Ctrl + B.

Another common method is: adding edges via the "Loop cut" shortcut: Ctrl + R.  
By default one edge will be added, you can enter a number or scroll the mouse wheel to modify the number of additions.
Moving the mouse allows you to select the direction of the added edges (horizontal or vertical).  
("Loop cut" will normally cut as far across as it can. If you want to avoid cutting some poly, hide it first by press H, make the cuts, then unhide everything by press Alt + H.)

<img src="pic1/_6.jpg" style="max-width:100%">




Next, to facilitate subsequent operations, we need to combine the connected objects into a whole by Boolean operations:

<img src="pic1/2.jpg" style="max-width:100%">

<img src="pic1/3.jpg" style="max-width:100%">

After apply, we need to delete the duplicate objects.
Repeating the above operation, the final result is:

<img src="pic1/4.jpg" style="max-width:100%">

Next, create a Cylinders and get the inverted mold by the difference operation of boolean.

<img src="pic1/5.jpg" style="max-width:100%">

<img src="pic1/6.jpg" style="max-width:100%">

In order to facilitate the demoulding, we have to cut the inverted mold, which can be cut in half in radial direction.
To make the edges smoother, I choose to cut them into 3 parts in the axial direction.  

Create three new solid Cylinders of the same size as in the previous step, but with different heights and positions, and then move to each of the three identical inverted molds.  
(The same inverted molds are copied by Ctrl + C and Ctrl + V, and then shifted precisely by G with numbers.)

<img src="pic1/7.jpg" style="max-width:100%">

<img src="pic1/8.jpg" style="max-width:100%">

<img src="pic1/9.jpg" style="max-width:100%">

This time, the boolean difference operation is not the result we want, so we need to fix it manually.  
Select the target, press the Tab key to enter edit mode, select and delete the faces in the picture:

<img src="pic1/10.jpg" style="max-width:100%">

Then switch to the edge selection tool, hold down Shift + Alt, and mouse left click on the target edge to automatically select a full circle.
If you can only select a part of the circle, you have to use the "Merge by Distance" to fix it first.

<img src="pic1/11.jpg" style="max-width:100%">

<img src="pic1/12.jpg" style="max-width:100%">

Then create a new face by "Fill" and repeat the same operation on the other side.

<img src="pic1/13.jpg" style="max-width:100%">

<img src="pic1/14.jpg" style="max-width:100%">

Finally we get the 3 inverted molds after cutting, before exporting,
we have to select all of them and use blender's built-in 3D-Print plug-in for auto-repair,
just click the "Make Manifold" button. We need to enable the 3D-Print plugin in Blender's settings first.

It is recommended to export 3 objects in sequence, first move the object to be exported to the origin of the coordinates, and delete the other objects.
(Please back up your documents first.)

<img src="pic1/15.jpg" style="max-width:100%">

Blender can also do some further smoothing operations, which are not needed here.

Finally, I like to use FreeCAD to check the exported stl files.

<img src="pic1/20.jpg" style="max-width:100%">


I sent the stl files to the optical curing printing service factory.
After I received the goods, the following assembly started:

<img src="pic2/1.jpg" style="max-width:100%">

<img src="pic2/2.jpg" style="max-width:100%">

The inside of the inverted mold and the connections are coated with petroleum jelly for easy release and to seal the connections. Only a small amount can be applied to the inside of the mold.

<img src="pic2/3.jpg" style="max-width:100%">

Mix 1:1 silicone ingredients and pour into the pouring mold.
After pouring, it is recommended to stir in the inverted mold to speed up the elimination of air bubbles.

<img src="pic2/4.jpg" style="max-width:100%">

After 10 hours, the remaining silicone material was formed.

<img src="pic2/5.jpg" style="max-width:100%">

The curing time of silicone material is 12~24 hours.
The area around the small hole in the pouring mold does not seem to be dry, so in order to achieve better results,
wait 30 hours before starting the demolding operation.

Silicone rubber removed from steel tubes:

<img src="pic2/6.jpg" style="max-width:100%">

<img src="pic2/7.jpg" style="max-width:100%">

<img src="pic2/8.jpg" style="max-width:100%">

<img src="pic2/9.jpg" style="max-width:100%">

The last ball is a little difficult to take out, the top is pulled while the bottom has to be pushed:

<img src="pic2/10.jpg" style="max-width:100%">

<img src="pic2/11.jpg" style="max-width:100%">

<img src="pic2/12.jpg" style="max-width:100%">

<img src="pic2/13.jpg" style="max-width:100%">

<img src="pic2/14.jpg" style="max-width:100%">

The same method is also suitable for making other silicone things in daily life.

Blender file: [finished.tar.bz2](finished.tar.bz2)

To learn more about Blender you can watch Blender Guru's video tutorials,
and I recommend downloading the "Blender Keyboard Shortcut Guide v2" pdf document summarized by Blender Guru.


Finally, by the way, I would like to show the sex robot made with a desktop robot arm years ago:

<img src="robot_arm.jpg" style="max-width:100%">

<br>
<a rel="license" href="http://creativecommons.org/licenses/by/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International License</a>.
