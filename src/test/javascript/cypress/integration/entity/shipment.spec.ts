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

describe('Shipment e2e test', () => {
  let startingEntitiesCount = 0;

  beforeEach(() => {
    cy.getOauth2Data();
    cy.get('@oauth2Data').then(oauth2Data => {
      cy.oauthLogin(oauth2Data, Cypress.env('E2E_USERNAME') || 'admin', Cypress.env('E2E_PASSWORD') || 'admin');
    });
    cy.intercept('GET', '/services/crm/api/shipments*').as('entitiesRequest');
    cy.visit('');
    cy.clickOnEntityMenuItem('shipment');
    cy.wait('@entitiesRequest').then(({ request, response }) => (startingEntitiesCount = response.body.length));
    cy.visit('/');
  });

  afterEach(() => {
    cy.get('@oauth2Data').then(oauth2Data => {
      cy.oauthLogout(oauth2Data);
    });
    cy.clearCache();
  });

  it('should load Shipments', () => {
    cy.intercept('GET', '/services/crm/api/shipments*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('shipment');
    cy.wait('@entitiesRequest');
    cy.getEntityHeading('Shipment').should('exist');
    if (startingEntitiesCount === 0) {
      cy.get(entityTableSelector).should('not.exist');
    } else {
      cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount);
    }
    cy.visit('/');
  });

  it('should load details Shipment page', () => {
    cy.intercept('GET', '/services/crm/api/shipments*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('shipment');
    cy.wait('@entitiesRequest');
    if (startingEntitiesCount > 0) {
      cy.get(entityDetailsButtonSelector).first().click({ force: true });
      cy.getEntityDetailsHeading('shipment');
      cy.get(entityDetailsBackButtonSelector).should('exist');
    }
    cy.visit('/');
  });

  it('should load create Shipment page', () => {
    cy.intercept('GET', '/services/crm/api/shipments*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('shipment');
    cy.wait('@entitiesRequest');
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('Shipment');
    cy.get(entityCreateSaveButtonSelector).should('exist');
    cy.visit('/');
  });

  it('should load edit Shipment page', () => {
    cy.intercept('GET', '/services/crm/api/shipments*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('shipment');
    cy.wait('@entitiesRequest');
    if (startingEntitiesCount > 0) {
      cy.get(entityEditButtonSelector).first().click({ force: true });
      cy.getEntityCreateUpdateHeading('Shipment');
      cy.get(entityCreateSaveButtonSelector).should('exist');
    }
    cy.visit('/');
  });

  /* this test is commented because it contains required relationships
  it('should create an instance of Shipment', () => {
    cy.intercept('GET', '/services/crm/api/shipments*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('shipment');
    cy.wait('@entitiesRequest')
      .then(({ request, response }) => startingEntitiesCount = response.body.length);
    cy.get(entityCreateButtonSelector).click({force: true});
    cy.getEntityCreateUpdateHeading('Shipment');

    cy.get(`[data-cy="trackingCode"]`).type('Mobility Account', { force: true }).invoke('val').should('match', new RegExp('Mobility Account'));


    cy.get(`[data-cy="date"]`).type('2021-02-12T20:40').invoke('val').should('equal', '2021-02-12T20:40');


    cy.get(`[data-cy="details"]`).type('Practical Plains', { force: true }).invoke('val').should('match', new RegExp('Practical Plains'));

    cy.setFieldSelectToLastOfEntity('invoice');

    cy.get(entityCreateSaveButtonSelector).click({force: true});
    cy.scrollTo('top', {ensureScrollable: false});
    cy.get(entityCreateSaveButtonSelector).should('not.exist');
    cy.intercept('GET', '/services/crm/api/shipments*').as('entitiesRequestAfterCreate');
    cy.visit('/');
    cy.clickOnEntityMenuItem('shipment');
    cy.wait('@entitiesRequestAfterCreate');
    cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount + 1);
    cy.visit('/');
  });
  */

  /* this test is commented because it contains required relationships
  it('should delete last instance of Shipment', () => {
    cy.intercept('GET', '/services/crm/api/shipments*').as('entitiesRequest');
    cy.intercept('DELETE', '/services/crm/api/shipments/*').as('deleteEntityRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('shipment');
    cy.wait('@entitiesRequest').then(({ request, response }) => {
      startingEntitiesCount = response.body.length;
      if (startingEntitiesCount > 0) {
        cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount);
        cy.get(entityDeleteButtonSelector).last().click({force: true});
        cy.getEntityDeleteDialogHeading('shipment').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click({force: true});
        cy.wait('@deleteEntityRequest');
        cy.intercept('GET', '/services/crm/api/shipments*').as('entitiesRequestAfterDelete');
        cy.visit('/');
        cy.clickOnEntityMenuItem('shipment');
        cy.wait('@entitiesRequestAfterDelete');
        cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount - 1);
      }
      cy.visit('/');
    });
  });
  */
});
