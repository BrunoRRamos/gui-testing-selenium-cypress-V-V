describe('customers', () => {
  beforeEach(() => {
    cy.visit('/admin');
    cy.get('[id="_username"]').type('sylius');
    cy.get('[id="_password"]').type('sylius');
    cy.get('.primary').click();
    cy.clickInFirst('a[href="/admin/customers/"]');
  });

  // Justificativa: Se fez necessario gerar nomes de email aleatorios
  // pois o sylius sempre mantem registro de guests para controle
  // e para que o teste de criar customer funcione deve ser 
  // utilizado um email que não esteja em uso.
  function genEmail() {
    const randomStr = Math.random().toString(36).substring(2, 8);
    return `${randomStr}`;
  }

  it('1- Update a customer phone number', () => {
    cy.get('[id="criteria_search_value"]').type('@gmail');
    cy.get('*[class^="ui blue labeled icon button"]').click();
    cy.get('*[class^="ui labeled icon button "]').last().click();
    cy.get('[id="sylius_customer_phoneNumber"]').scrollIntoView().clear().type('999.999.9999');
    cy.get('[id="sylius_save_changes_button"]').scrollIntoView().click();

    cy.get('body').should('contain', 'Customer has been successfully updated.');
  });

  it('2- Create new customer', () => {
    cy.findAllByText(/^Create/i).first().click();
    cy.get('#sylius_customer_firstName').type("Jobson");
    cy.get('#sylius_customer_lastName').type("Silva");
    cy.get('#sylius_customer_email').type(`${genEmail()}@gmail.com`);
    cy.get('#sylius_customer_group').select("Retail");
    cy.get('#sylius_customer_gender').select("Male");
    cy.get('#sylius_customer_birthday').type("1987-12-12");
    cy.get('#sylius_customer_phoneNumber').type("99999999");
    cy.findAllByText(/^Create/i).first().click();

    cy.get('body').should('contain', 'Customer has been successfully created.');
  });

  it('3- Search for a user', () => {
    cy.get('#criteria_search_type').select("equal");
    cy.get('#criteria_search_value').type("Jobson");
    cy.get('.sylius-autocomplete').type("Retail{enter}");
    cy.findAllByText(/^Filter/i).first().click();

    cy.findAllByText(/^Jobson/i).should("be.visible");
    cy.findAllByText(/^Silva/i).should("be.visible");
  });

  it('4- Grant account credentials', () => {
    cy.get('.segment').scrollTo("right");
    cy.findAllByText(/^Edit/i).first().click();
    cy.findAllByText(/^Customer can login to the store?/i).click();
    cy.get('#sylius_customer_user_plainPassword').type("pass123");
    cy.findAllByText(/^Enabled/i).click();
    cy.findAllByText(/^Verified/i).click();
    cy.findAllByText(/^Save changes/i).first().click();

    cy.get('body').should('contain', 'Customer has been successfully updated.');
  });

  it('5- Delete custumer', () => {
    cy.get('.segment').scrollTo("right");
    cy.findAllByText(/^Show/i).eq(2).click();
    cy.findAllByText(/^Jobson Silva/i).should("be.visible");
    cy.findAllByText(/^Delete/i).first().click();
    cy.findAllByText(/^Yes/i).first().click();

    cy.get('body').should('contain', 'Shop user has been successfully deleted.');
  });
});
