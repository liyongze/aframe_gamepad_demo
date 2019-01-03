AFRAME.registerComponent('pad_version2',{
    schema:{
        control_mode:{type:'string',default:"mode1"},
        pos_center:{type:'vec3',default:{x:0,y:0,z:-4}}
    },
    init:function(){

        //var gamepads = navigator.getGamepads();
        //console.log(gamepads);

        window.addEventListener("gamepadconnected", function(e){
            console.log("pad has been connected");
        })

        //console.log("ok")

    },
    tick: function(){
        var control_mode = this.data.control_mode;
        if(control_mode == "mode1"){
            var gamepad = navigator.getGamepads()[0];
            if(gamepad != null) {
                for (var indice_bouton in gamepad.buttons) {
                    if (gamepad.buttons[indice_bouton].pressed) {
                        console.log("bouton_indice",indice_bouton);
                        var el = this.el;
                        var pos = el.getAttribute("position");
                        if(indice_bouton == 3 || indice_bouton == 8){
                            pos.y -= 0.03;
                            el.setAttribute("position", pos);
                        }
                        if(indice_bouton == 1){
                            pos.y += 0.03;
                            el.setAttribute("position", pos);
                        }
                        if(indice_bouton == 0){
                            pos.x += 0.03;
                            el.setAttribute("position", pos);
                        }
                        if(indice_bouton == 4 || indice_bouton == 9){
                            pos.x -= 0.03;
                            el.setAttribute("position", pos);
                        }
                        if(indice_bouton == 7){
                            pos.z += 0.03;
                            el.setAttribute("position", pos);
                        }
                        if(indice_bouton == 6){
                            pos.z -= 0.03;
                            el.setAttribute("position", pos);
                        }

                    }
                }
                var el = this.el;
                var ros = el.getAttribute("rotation")
                ros.x += gamepad.axes[0] * 1
                ros.y += gamepad.axes[1] * 1
                el.setAttribute("rotation", ros)
            }
        }
        if(control_mode == "mode2"){
            var gamepad = navigator.getGamepads()[0];
            var pos_center = this.data.pos_center;
            if(gamepad != null) {
                for (var indice_bouton in gamepad.buttons) {
                    if (gamepad.buttons[indice_bouton].pressed) {
                        var el = this.el;
                        var pos = el.getAttribute("position");
                        var l = {x:pos.x-pos_center.x,y:pos.y-pos_center.y,z:pos.z-pos_center.z};
                        var length = Math.sqrt(l.x*l.x+l.y*l.y+l.z*l.z);
                        var angle_elevation = Math.acos(Math.sqrt(l.x*l.x+l.z*l.z)/length);
                        var angle_plane = Math.atan(l.x/l.z);
                        var delta_l = 0.01;
                        if(indice_bouton == 7){  //far
                            pos.x += delta_l*Math.cos(angle_elevation)*Math.sin(angle_plane);
                            pos.y += delta_l*Math.sin(angle_elevation);
                            pos.z += delta_l*Math.cos(angle_elevation)*Math.cos(angle_plane);
                            el.setAttribute("position", pos);
                        }
                        if(indice_bouton == 6){   //near
                            pos.x -= delta_l*Math.cos(angle_elevation)*Math.sin(angle_plane);
                            pos.y -= delta_l*Math.sin(angle_elevation);
                            pos.z -= delta_l*Math.cos(angle_elevation)*Math.cos(angle_plane);
                            el.setAttribute("position", pos);
                        }

                    }
                }
                if(gamepad.axes[0]!=0 || gamepad.axes[1]!=0) {
                    var el = this.el;
                    var rot1 = el.getAttribute("rotation");
                    var delta_rot1 = -1 * gamepad.axes[0];
                    var delta_rot2 = -1*gamepad.axes[1];
                    var rot2 = {x: rot1.x - delta_rot1, y: rot1.y-delta_rot2, z: rot1.z};
                    pos = el.getAttribute("position");
                    var l = {x:pos.x-pos_center.x,y:pos.y-pos_center.y,z:pos.z-pos_center.z};
                    var length = Math.sqrt(l.x*l.x+l.y*l.y+l.z*l.z);
                    var angle_elevation = Math.acos(Math.sqrt(l.x*l.x+l.z*l.z)/length) + delta_rot1*Math.PI/180;
                    var angle_plane = Math.atan(l.x/l.z) - delta_rot2*Math.PI/180;
                    pos.x = pos_center.x + length*Math.cos(angle_elevation)*Math.sin(angle_plane);
                    pos.z = pos_center.z + length*Math.cos(angle_elevation)*Math.cos(angle_plane);
                    pos.y = pos_center.y + length*Math.sin(angle_elevation);
                    el.setAttribute("position",pos);
                    el.setAttribute("rotation", rot2);

                }

            }
        }

    }
})

/*
<script>
            window.addEventListener("gamepadconnected", event =>{
                console.log(event);
                var camera = document.querySelector('#camera');
                camera.setAttribute('controller','');
            });
            AFRAME.registerComponent('controller',{
            tick: function () {
            var gamepads = navigator.getGamepads();
                    for(var i in gamepads[0].buttons){
                        if(gamepads[0].buttons[i].pressed){
                            console.log(i);
                            console.log(gamepads[0].axes[0])
                             console.log(gamepads[0].axes[1])
                        }
                    };
                }
            });
         </script>
 */