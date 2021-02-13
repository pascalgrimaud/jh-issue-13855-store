import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('Invoice e2e test', () => {
  let startingEntitiesCount = 0;

  beforeEach(() => {
    cy.getOauth2Data();
    cy.get('@oauth2Data').then(oauth2Data => {
      cy.oauthLogin(oauth2Data, Cypress.env('E2E_USERNAME') || 'admin', Cypress.env('E2E_PASSWORD') || 'admin');
    });
    cy.intercept('GET', '/services/crm/api/invoices*').as('entitiesRequest');
    cy.visit('');
    cy.clickOnEntityMenuItem('invoice');
    cy.wait('@entitiesRequest').then(({ request, response }) => (startingEntitiesCount = response.body.length));
    cy.visit('/');
  });

  afterEach(() => {
    cy.get('@oauth2Data').then(oauth2Data => {
      cy.oauthLogout(oauth2Data);
    });
    cy.clearCache();
  });

  it('should load Invoices', () => {
    cy.intercept('GET', '/services/crm/api/invoices*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('invoice');
    cy.wait('@entitiesRequest');
    cy.getEntityHeading('Invoice').should('exist');
    if (startingEntitiesCount === 0) {
      cy.get(entityTableSelector).should('not.exist');
    } else {
      cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount);
    }
    cy.visit('/');
  });

  it('should load details Invoice page', () => {
    cy.intercept('GET', '/services/crm/api/invoices*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('invoice');
    cy.wait('@entitiesRequest');
    if (startingEntitiesCount > 0) {
      cy.get(entityDetailsButtonSelector).first().click({ force: true });
      cy.getEntityDetailsHeading('invoice');
      cy.get(entityDetailsBackButtonSelector).should('exist');
    }
    cy.visit('/');
  });

  it('should load create Invoice page', () => {
    cy.intercept('GET', '/services/crm/api/invoices*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('invoice');
    cy.wait('@entitiesRequest');
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('Invoice');
    cy.get(entityCreateSaveButtonSelector).should('exist');
    cy.visit('/');
  });

  it('should load edit Invoice page', () => {
    cy.intercept('GET', '/services/crm/api/invoices*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('invoice');
    cy.wait('@entitiesRequest');
    if (startingEntitiesCount > 0) {
      cy.get(entityEditButtonSelector).first().click({ force: true });
      cy.getEntityCreateUpdateHeading('Invoice');
      cy.get(entityCreateSaveButtonSelector).should('exist');
    }
    cy.visit('/');
  });

  it('should create an instance of Invoice', () => {
    cy.intercept('GET', '/services/crm/api/invoices*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('invoice');
    cy.wait('@entitiesRequest').then(({ request, response }) => (startingEntitiesCount = response.body.length));
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('Invoice');

    cy.get(`[data-cy="code"]`).type('embrace', { force: true }).invoke('val').should('match', new RegExp('embrace'));

    cy.get(`[data-cy="date"]`).type('2021-02-13T09:27').invoke('val').should('equal', '2021-02-13T09:27');

    cy.get(`[data-cy="details"]`).type('Towels', { force: true }).invoke('val').should('match', new RegExp('Towels'));

    cy.get(`[data-cy="status"]`).select('PAID');

    cy.get(`[data-cy="paymentMethod"]`).select('CASH_ON_DELIVERY');

    cy.get(`[data-cy="paymentDate"]`).type('2021-02-13T09:00').invoke('val').should('equal', '2021-02-13T09:00');

    cy.get(`[data-cy="paymentAmount"]`).type('66654').should('have.value', '66654');

    cy.get(entityCreateSaveButtonSelector).click({ force: true });
    cy.scrollTo('top', { ensureScrollable: false });
    cy.get(entityCreateSaveButtonSelector).should('not.exist');
    cy.intercept('GET', '/services/crm/api/invoices*').as('entitiesRequestAfterCreate');
    cy.visit('/');
    cy.clickOnEntityMenuItem('invoice');
    cy.wait('@entitiesRequestAfterCreate');
    cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount + 1);
    cy.visit('/');
  });

  it('should delete last instance of Invoice', () => {
    cy.intercept('GET', '/services/crm/api/invoices*').as('entitiesRequest');
    cy.intercept('DELETE', '/services/crm/api/invoices/*').as('deleteEntityRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('invoice');
    cy.wait('@entitiesRequest').then(({ request, response }) => {
      startingEntitiesCount = response.body.length;
      if (startingEntitiesCount > 0) {
        cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount);
        cy.get(entityDeleteButtonSelector).last().click({ force: true });
        cy.getEntityDeleteDialogHeading('invoice').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click({ force: true });
        cy.wait('@deleteEntityRequest');
        cy.intercept('GET', '/services/crm/api/invoices*').as('entitiesRequestAfterDelete');
        cy.visit('/');
        cy.clickOnEntityMenuItem('invoice');
        cy.wait('@entitiesRequestAfterDelete');
        cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount - 1);
      }
      cy.visit('/');
    });
  });
});
