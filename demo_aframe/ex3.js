AFRAME.registerComponent('pad_version3',{
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
                        //console.log("bouton_indice",indice_bouton);
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
                    //var delta_rot1 = -1*gamepad.axes[0];
                    //var delta_rot2 = -1*gamepad.axes[1];
                    var delta_rot1 = -1*gamepad.axes[0];
                    var delta_rot2 = -1*gamepad.axes[1];
                    var rot2 = {x: rot1.x - delta_rot1, y: rot1.y-delta_rot2, z: rot1.z};
                    pos = el.getAttribute("position");
                    var l = {x:pos.x-pos_center.x,y:pos.y-pos_center.y,z:pos.z-pos_center.z};
                    var length = Math.sqrt(l.x*l.x+l.y*l.y+l.z*l.z);
                    if(l.z<0 && l.y>0){
                        var angle_elevation = Math.acos(Math.sqrt(l.x*l.x+l.z*l.z)/length) - delta_rot1*Math.PI/180;
                        pos.y = pos_center.y + length*Math.sin(angle_elevation);
                    }else if(l.z>0 &&l.y<0){
                        var angle_elevation = Math.acos(Math.sqrt(l.x*l.x+l.z*l.z)/length) - delta_rot1*Math.PI/180;
                        pos.y = pos_center.y - length*Math.sin(angle_elevation);
                    }else if(l.z<0 &&l.y<0){
                        var angle_elevation = Math.acos(Math.sqrt(l.x*l.x+l.z*l.z)/length) + delta_rot1*Math.PI/180;
                        pos.y = pos_center.y - length*Math.sin(angle_elevation);
                    }else{
                        var angle_elevation = Math.acos(Math.sqrt(l.x*l.x+l.z*l.z)/length) + delta_rot1*Math.PI/180;
                        pos.y = pos_center.y + length*Math.sin(angle_elevation);
                    }

                    if(l.x<0 && l.z<0){
                        var angle_plane = Math.atan(l.z/l.x) + delta_rot2*Math.PI/180;
                        pos.x = pos_center.x - length*Math.cos(angle_elevation)*Math.cos(angle_plane);
                        pos.z = pos_center.z - length*Math.cos(angle_elevation)*Math.sin(angle_plane);
                    }else if(l.x>0 && l.z<0){
                        var angle_plane = Math.atan(-l.z/l.x) - delta_rot2*Math.PI/180;
                        pos.x = pos_center.x + length*Math.cos(angle_elevation)*Math.cos(angle_plane);
                        pos.z = pos_center.z - length*Math.cos(angle_elevation)*Math.sin(angle_plane);
                    }else if(l.x>0 && l.z>0){
                        var angle_plane = Math.atan(l.x/l.z) - delta_rot2*Math.PI/180;
                        pos.x = pos_center.x + length*Math.cos(angle_elevation)*Math.sin(angle_plane);
                        pos.z = pos_center.z + length*Math.cos(angle_elevation)*Math.cos(angle_plane);
                    }else {
                        var angle_plane = Math.atan(-l.x/l.z) + delta_rot2*Math.PI/180;
                        pos.x = pos_center.x - length*Math.cos(angle_elevation)*Math.sin(angle_plane);
                        pos.z = pos_center.z + length*Math.cos(angle_elevation)*Math.cos(angle_plane);
                    }

                    console.log(l)
                    console.log(angle_plane)
                    console.log(angle_elevation)
                    el.setAttribute("position",pos);
                    el.setAttribute("rotation", rot2);

                }

            }
        }

    }
})

AFRAME.registerComponent('pad-controller',{
    init:function() {
        this.el.addEventListener("mouseenter", function (event) {
            event.target.setAttribute("state","t")
        })
        this.el.addEventListener("mouseleave", function (event) {
            event.target.setAttribute("state","f")
        })
    },
    tick:function () {
        var gamepad = navigator.getGamepads()[0];
        if(this.el.getAttribute("state") == "t"){
            if (gamepad.buttons[6].pressed){
                this.el.setAttribute("mode", "1");
            }
            if(gamepad.buttons[7].pressed){
                this.el.setAttribute("mode", "2");
            }
        }
        if(this.el.getAttribute("state") == "f"){
            if (gamepad.buttons[6].pressed||gamepad.buttons[7].pressed){
                this.el.setAttribute("mode", "0"); //退出当前模式
            }
        }
        if(this.el.getAttribute("mode") == "0"){
            //退出模式，应该恢复为相机的mode1
            var camera = document.getElementById("camera");
            camera.setAttribute("pad_version3",{control_mode:"mode1"});
            this.el.setAttribute("mode","3");//为了不让这个干扰其他物件的操作
        }
        if(this.el.getAttribute("mode") == "1"){
            //mode1
            // 如何能够让摄像头不受手柄控制而物体受,策略是给camera传一个mode参数，
            // 并且camera无法对这个参数做出响应
            //我们要通过手柄来改变选定物体的位置和角度
            var camera = document.getElementById("camera");
            camera.setAttribute("pad_version3",{control_mode:"mode_undefine"});
            if(gamepad != null) {
                for (var indice_bouton in gamepad.buttons) {
                    if (gamepad.buttons[indice_bouton].pressed) {
                        var el = this.el;
                        var pos = el.getAttribute("position");
                        if(indice_bouton == 3 || indice_bouton == 8){
                            pos.y += 0.03;
                            el.setAttribute("position", pos);
                        }
                        if(indice_bouton == 1){
                            pos.y -= 0.03;
                            el.setAttribute("position", pos);
                        }
                        if(indice_bouton == 0){
                            pos.x -= 0.03;
                            el.setAttribute("position", pos);
                        }
                        if(indice_bouton == 4 || indice_bouton == 9){
                            pos.x += 0.03;
                            el.setAttribute("position", pos);
                        }

                    }
                }
                var el = this.el;
                var rot = el.getAttribute("rotation")
                rot.x -= gamepad.axes[0] * 1
                rot.y += gamepad.axes[1] * 1
                el.setAttribute("rotation", rot)
            }
        }
        if(this.el.getAttribute("mode") == "2"){
            //mode2
            // 这个模式下摄像头进行移动，物体无需移动，给camera传中心点坐标
            var camera = document.getElementById("camera");
            var pos = this.el.getAttribute("position");
            camera.setAttribute("pad_version3",{control_mode:"mode2",pos_center:pos});
            var posc = camera.getAttribute("position");
            console.log("position of camera",posc);
        }
    }

})


