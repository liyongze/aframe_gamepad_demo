AFRAME.registerComponent('pad_version1',{
    init:function(){

        //var gamepads = navigator.getGamepads();
        //console.log(gamepads);

        window.addEventListener("gamepadconnected", function(e){
            console.log("pad has been connected");
        })

        //console.log("ok")

    },
    tick: function(){
        var gamepad = navigator.getGamepads()[0];
        if(gamepad != null) {
            for (var indice_bouton in gamepad.buttons) {
                if (gamepad.buttons[indice_bouton].pressed) {
                    console.log("bouton_indice",indice_bouton);
                    el = this.el
                    pos = el.getAttribute("position")
                    if(indice_bouton == 3 || indice_bouton == 8){
                        pos.y -= 0.03
                        el.setAttribute("position", pos)
                    }
                    if(indice_bouton == 1){
                        pos.y += 0.03
                        el.setAttribute("position", pos)
                    }
                    if(indice_bouton == 0){
                        pos.x += 0.03
                        el.setAttribute("position", pos)
                    }
                    if(indice_bouton == 4 || indice_bouton == 9){
                        pos.x -= 0.03
                        el.setAttribute("position", pos)
                    }
                    if(indice_bouton == 7){
                        pos.z += 0.03
                        el.setAttribute("position", pos)
                    }
                    if(indice_bouton == 6){
                        pos.z -= 0.03
                        el.setAttribute("position", pos)
                    }

                }
            }

            el = this.el
            ros = el.getAttribute("rotation")
            ros.x += gamepad.axes[0] * 1
            ros.y += gamepad.axes[1] * 1
            el.setAttribute("rotation", ros)
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