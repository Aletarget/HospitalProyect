
const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  const correo = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
        const response = await fetch("https://hospitalproyect-production.up.railway.app/auth/login", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ correo, password })
        });
    
        const data = await response.json();

        if (response.ok) {
        const token = data.token;

        localStorage.setItem('token', token);
        // Decodifica el token para extraer el permiso
        const payload = jwt_decode(token);
        const permisos = payload.permisos; // Este debe coincidir con el campo que pusiste en el backend al firmar el token
        const activo = payload.estado;
        
        if(!activo){
            alert(`El usuario actualmente se encuentra inactivo, favor comunicarse con un administrativo`)
            return;
        }

        alert('Inicio de sesión exitoso');
        console.log('Payload decodificado:', payload);
        switch (permisos) {
            case 'admin':
            window.location.href = './vistas/viewAdmin.html';
            break;
            case 'medico':
            window.location.href = './vistas/viewMedic.html';
            break;
            case 'user':
            window.location.href = './vistas/viewUsers.html';
            break;
            case 'super-user':
            window.location.href = './vistas/viewAdmin.html';
            break;
            case 'farmaceutico':
            window.location.href = './vistas/viewFarmaceutico.html';
            break;
            default:
            alert('Permiso no reconocido');
        }
    
        } else {
        alert('Error: ' + (data.message || 'No se pudo iniciar sesión'));
        }

  } catch (error) {
    console.error('Error de red o servidor:', error);
    alert('No se pudo conectar con el servidor');
  }
});


 