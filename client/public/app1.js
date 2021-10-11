const SERVER_URL = 'http://localhost:5000';


const loggedin = localStorage.getItem('isAuthenticated');
const user = localStorage.getItem('user');
const deviceId = localStorage.getItem('deviceID')

if (!loggedin) {
    const path = window.location.pathname;
    if (path !== '/login' && path !== '/registration') {
        location.href = '/login';
    }
}


$(document).ready(() => {
    document.getElementById("title").textContent = `Switch ${deviceId} Info Page`;
    $.get(`${SERVER_URL}/device` , {deviceId} ).then((res) => {

        //console.log(res.switch.colour)

        c = []
        c.push(res.switch.colour.red)
        c.push(res.switch.colour.green)
        c.push(res.switch.colour.blue)

        var b = c.map(function(x){             //For each array element
            x = parseInt(x).toString(16);      //Convert to a base16 string
            return (x.length==1) ? "0"+x : x;  //Add zero if we get only one character
        })

        b = "#"+b.join("");

        document.getElementById("ID").textContent = deviceId

        let _state = (res.switch.state) ? "On" : "Off";
        let brightness = res.switch.brightness * 100

        document.getElementById("state").textContent = _state
        document.getElementById("brightness").textContent = `${brightness}%`
        document.getElementById("colour").style.backgroundColor = b
        

        res.switch.lightsIDs.forEach(id => {
            var li = document.createElement('li');
            li.innerHTML = id;
            document.getElementById("list").appendChild(li);
        });
    })

})

$('#statebtn').on('click', () =>{
    $.get(`${SERVER_URL}/device` , {deviceId} ).then((res) => {
        let _state = (!res.switch.state) ? "On" : "Off";
        document.getElementById("state").textContent = _state
        let brightness = (!res.switch.state) ? 1 : 0;
        let _switch = {
            ID: deviceId,
            state: !res.switch.state,
            brightness:brightness,
            colour:{red:0,green:0,blue:0},
            lightsIDs:res.switch.lightsIDs
        }

        brightness = _switch.brightness * 100
        document.getElementById("brightness").textContent = `${brightness}%`

        let client = true
        _switch.lightsIDs.forEach(id => {
            light = {
                'ID': id,
                'state': _switch.state,
                'brightness': _switch.brightness,
                'colour': {'red': _switch.colour.red, 'green': _switch.colour.green, 'blue': _switch.colour.blue}
            }
            $.post(`${SERVER_URL}/updateLight`, { light, client}).then(res => {
                console.log(`statusCode: ${res.status}`)
            }).catch(error => {
                console.error(error)
            })
        });   
        $.post(`${SERVER_URL}/updateSwitch`, {_switch, client}).then(res => {
            console.log(`statusCode: ${res.status}`)
        })
        .catch(error => {
            console.error(error)
        })     
    });
    




})