const form = document.getElementById('register-form');
const errorMessage = document.getElementById('error-message');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const username = document.getElementById('usuario').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmar-password').value;

  if (username === '' || email === '' || password === '' || confirmPassword === '') {
    errorMessage.textContent = 'Preencha todos os campos!';
    return;
  }

  if (password !== confirmPassword) {
    errorMessage.textContent = 'Senhas não conferem!';
    return;
  }

  // Simulação da API
  const apiResponse = {
    success: true,
    message: 'Usuário criado com sucesso!'
  };

  // Verifica se a criação foi bem-sucedida
  if (apiResponse.success) {
    window.location.href = 'success';
  } else {
    errorMessage.textContent = 'Erro ao registrar!';
  }
});