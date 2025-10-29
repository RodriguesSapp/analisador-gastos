// home.js

const btnRegister = document.getElementById('btnRegister');
const registerFormContainer = document.getElementById('registerFormContainer');
const homeIntro = document.getElementById('homeIntro');
const btnBackToHome = document.getElementById('btnBackToHome');

// Mostrar formulário de cadastro
btnRegister.addEventListener('click', () => {
  homeIntro.style.display = 'none';
  registerFormContainer.style.display = 'block';
});

// Voltar para a home
btnBackToHome.addEventListener('click', (e) => {
  e.preventDefault();
  registerFormContainer.style.display = 'none';
  homeIntro.style.display = 'block';
});

// Simulação de cadastro
const registerForm = document.getElementById('registerForm');
registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = registerForm.username.value.trim();
  const email = registerForm.email.value.trim();
  const password = registerForm.password.value;
  const confirmPassword = registerForm.confirmPassword.value;

  const registerError = document.getElementById('registerError');
  const registerSuccess = document.getElementById('registerSuccess');

  if (password !== confirmPassword) {
    registerError.textContent = "As senhas não coincidem!";
    registerSuccess.textContent = "";
    return;
  }

  console.log({ username, email, password });

  registerError.textContent = "";
  registerSuccess.textContent = "Cadastro realizado com sucesso!";
});
