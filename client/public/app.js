const SERVER_URL = 'http://localhost:5000';

// const token = localStorage.getItem('token');
// $.ajaxSetup({
//     headers: { Authorization: 'Bearer ' + token }
// })


const loggedin = localStorage.getItem('isAuthenticated');
const user = localStorage.getItem('user');
if (loggedin) {
    $.get(`${SERVER_URL}/devices`, {user}).then((res) => {
        res.switches.forEach((_switch) => {
            $('#devices tbody').append(` <tr data-device-id=${_switch.ID}>
                    <td>${_switch.ID}</td>
                    <td>${_switch.state}</td>
                    <td>${_switch.brightness}</td>
                    <td>${_switch.colour.red}</td>
                    <td>${_switch.colour.green}</td>
                    <td>${_switch.colour.blue}</td>
                </tr>` );
        });
        $('#devices tbody tr').on('click', (e) => {
            const deviceId = e.currentTarget.getAttribute('data-device-id');
            localStorage.setItem('deviceID', deviceId);
            location.href = '/deviceInfo'
        });
    }) 
} else {
    const path = window.location.pathname;
    if (path !== '/login' && path !== '/registration') {
        location.href = '/login';
    }
}


$('#login').on('click', () => {
    const entered_username = $('#entered_username').val();
    const entered_password = $('#entered_password').val();

    console.log(SERVER_URL);

    $.post(`${SERVER_URL}/authenticate`, { entered_username, entered_password }).then((response) => {
        if (response.success) {
            localStorage.setItem('user', entered_username);
            localStorage.setItem('isAdmin', response.isAdmin);
            localStorage.setItem('isAuthenticated', true);
            location.href = '/';
        } else {
            $('#message').append(`<p class="alert alert-danger">${response}</p>`);
            console.log(user);
            console.log(password);
        }
    });
});

$('#register').on('click', () => {
    const entered_username = $('#entered_username').val();
    const entered_password = $('#entered_pass1').val();
    const entered_password2 = $('#entered_pass2').val();
    if (entered_password == entered_password2) {
        $.post(`${SERVER_URL}/registration`, { entered_username, entered_password }).then((response) => {
            if (response.success) {
                location.href = '/login';
            } else {
                $('#message').append(`<p class="alert alert-danger">${response}</p>`);
            }
        })
    }
    else if (entered_password != entered_password2) {
        document.getElementById('message').innerHTML = "Passwords must match";
    }
});