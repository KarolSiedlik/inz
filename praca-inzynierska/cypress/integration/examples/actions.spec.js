/// <reference types="cypress" />

const { functionsIn } = require("cypress/types/lodash");

const timestamp = Date.now();

const userData = {
  email: `user${timestamp}@test.com`,
  password: 'password',
  firstName: 'test',
  lastName: 'user',
  birthDate: '2020-12-12',
  height: '100',
  weight: '50',
}

const urlPath = {
  register: 'register',
  login: 'login',
}

const selectors = {
  registerLink: '#register',
  emailInput: '#inputEmail',
  passwordInput: '#inputPassword',
  checkPasswordInput: '#checkPassword',
  registerButton: '#registerBtn',
  loginButton: '#loginBtn',
  loginSubmitButton: '#loginSubmitButton',
  firstNameInput: '#firstName',
  lastNameInput: '#lastName',
  birthDateInput: '#birthDate',
  sexRadioButton: '.first-login__sex__inner-first > .ng-valid',
  heightInput: '#height',
  weightInput: '#weight',
  firstLoginFormSubmitButton: '.first-login__submit-wrapper > .btn', 
}

context('Application - registering and logging in', () => {
  beforeEach(() => {
    reloadApplication();
  })

  it('should register new user', () => {
    navigateToRegisterPage();
    fillAndSubmitRegisterForm();
    expectPageToNotBeRegister();
  })

  it('should login exisiting user', () => {
    navigateToLoginPage();
    fillAndSubmitLoginForm();
    expectPageToNotBeLogin();
  })
});

context('Application - filling user info', () => {
  beforeEach(() => {
    reloadApplication();
    loginTestUser();
  })

  it('should fill user info for the first time', () => {
    fillAndSubmitFirstInformationForm();
  });
});

function loginTestUser() {
  navigateToLoginPage();
  fillAndSubmitLoginForm();
}

function reloadApplication() {
  const appUrl = 'localhost:4200';
  cy.visit(appUrl);
}

function fillAndSubmitFirstInformationForm() {
  typeInField(selectors.firstNameInput, userData.firstName)
  typeInField(selectors.lastNameInput, userData.lastName)
  typeInField(selectors.birthDateInput, userData.birthDate)
  clickOnElement(selectors.sexRadioButton);
  typeInField(selectors.heightInput, userData.height);
  typeInField(selectors.weightInput, userData.weight);
  expectElementToNotBeDisabled(selectors.firstLoginFormSubmitButton);
  clickOnElement(selectors.firstLoginFormSubmitButton);
}

function expectPageToNotBeLogin() {
  expectUrlToNotInclude(urlPath.login);
}

function fillAndSubmitLoginForm() {
  typeInField(selectors.emailInput, userData.email);
  typeInField(selectors.passwordInput, userData.password);
  expectElementToNotBeDisabled(selectors.loginSubmitButton);
  clickOnElement(selectors.loginSubmitButton);
}

function navigateToLoginPage() {
  clickOnElement(selectors.loginButton);
}

function navigateToRegisterPage() {
  clickOnElement(selectors.registerLink);
}

function fillAndSubmitRegisterForm() {
  typeInField(selectors.emailInput, userData.email);
  typeInField(selectors.passwordInput, userData.password);
  typeInField(selectors.checkPasswordInput, userData.password);
  expectElementToNotBeDisabled(selectors.registerButton);
  clickOnElement(selectors.registerButton);
}

function expectPageToNotBeRegister() {
  expectUrlToNotInclude(urlPath.register);
}

function expectUrlToNotInclude(path) {
  cy.url().should('not.include', path);
}

function expectElementToNotBeDisabled(element) {
  cy.get(element).should('not.be.disabled');
}

function clickOnElement(element) {
  cy.get(element).click();
}

function typeInField(field, text) {
  cy.get(field).type(text);
}
