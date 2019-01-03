/*
window.addEventListener("gamepadconnected", function(e){
    var sceneEl = document.querySelector('a-scene');
    var entityEl = document.createElement('a-entity');
    entityEl.setAttribute('controller', '');
    entityEl.setAttribute('id', 'controleur');
    sceneEl.appendChild(entityEl);
})
*/
var sceneEl = document.querySelector('a-scene');
var entityEl = document.createElement('a-entity');
entityEl.setAttribute('controller', '');
entityEl.setAttribute('id', 'controleur');
sceneEl.appendChild(entityEl);
window.addEventListener("gamepaddisconnected", function(e){
    var sceneEl = document.querySelector('a-scene');
    var entityEl = document.getElementById("controleur");
    sceneEl.removeChild(entityEl);
})

/////////////
var pretarget = 0;
var box = document.getElementById("a");
var sphere = document.getElementById("b");
var cylinder = document.getElementById("c");
box.addEventListener("mouseenter", function (e) {
    pretarget = e.target;
})
box.addEventListener("mouseleave", function (e) {
    pretarget = 0;
})
sphere.addEventListener("mouseenter", function (e) {
    pretarget = e.target;
})
sphere.addEventListener("mouseleave", function (e) {
    pretarget = 0;
})
cylinder.addEventListener("mouseenter", function (e) {
    pretarget = e.target;
})
cylinder.addEventListener("mouseleave", function (e) {
    pretarget = 0;
})
//////////////
AFRAME.registerComponent('controller', {

    schema:{
        target:{type:'selector', default:"undefine"},
        mode:{type:'string',default:"undefine"}
    },

    init:function () {
        console.log("I am back");
    },
    tick:function(){
        var gamepad = navigator.getGamepads()[0];
        if(gamepad != null){
            if(gamepad.buttons[7].pressed && pretarget != 0){
                console.log("mode2");
                this.data.mode = "mode2";     //物体控制模式
                this.data.target = pretarget;
            }
            if(gamepad.buttons[6].pressed && pretarget != 0){
                console.log("mode3");
                this.data.mode = "mode3";      //环绕模式
                this.data.target = pretarget;
            }
            if(gamepad.buttons[6].pressed || gamepad.buttons[7].pressed){
                if(pretarget == 0){
                    console.log("mode1")
                    this.data.mode = "mode1" ; //相机自由模式
                    this.data.target = "undefine";
                }
            }

            if(gamepad.buttons[1].pressed && this.data.mode == "mode3"){
                this.data.mode = "mode1";
                this.data.target = "undefine";
            }

        }
        if(this.data.mode == "mode2"){
            var camera = document.getElementById("camera");
            camera.setAttribute("pad_version3",{control_mode:"mode_undefine"});
            if(gamepad != null) {
                for (var indice_bouton in gamepad.buttons) {
                    if (gamepad.buttons[indice_bouton].pressed) {
                        var el = this.data.target;
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
                var el = this.data.target;
                var rot = el.getAttribute("rotation")
                rot.x -= gamepad.axes[0] * 1
                rot.y += gamepad.axes[1] * 1
                el.setAttribute("rotation", rot)
            }
        }
        if(this.data.mode == "mode1"){
            var camera = document.getElementById("camera");
            camera.setAttribute("pad_version3",{control_mode:"mode1"});
        }
        if(this.data.mode == "mode3"){
            var camera = document.getElementById("camera");
            var pos_target = this.data.target.getAttribute("position");
            camera.setAttribute("pad_version3",{control_mode:"mode2",pos_center:pos_target});
        }

    },
    remove:function () {
        console.log("I'll be back")
    }
})