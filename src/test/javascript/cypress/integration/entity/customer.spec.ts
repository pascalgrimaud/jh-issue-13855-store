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

describe('Customer e2e test', () => {
  let startingEntitiesCount = 0;

  beforeEach(() => {
    cy.getOauth2Data();
    cy.get('@oauth2Data').then(oauth2Data => {
      cy.keycloackLogin(oauth2Data, 'user');
    });
    cy.intercept('GET', '/services/crm/api/customers*').as('entitiesRequest');
    cy.visit('');
    cy.clickOnEntityMenuItem('customer');
    cy.wait('@entitiesRequest').then(({ request, response }) => (startingEntitiesCount = response.body.length));
    cy.visit('/');
  });

  afterEach(() => {
    cy.get('@oauth2Data').then(oauth2Data => {
      cy.keycloackLogout(oauth2Data);
    });
    cy.clearCache();
  });

  it('should load Customers', () => {
    cy.intercept('GET', '/services/crm/api/customers*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('customer');
    cy.wait('@entitiesRequest');
    cy.getEntityHeading('Customer').should('exist');
    if (startingEntitiesCount === 0) {
      cy.get(entityTableSelector).should('not.exist');
    } else {
      cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount);
    }
    cy.visit('/');
  });

  it('should load details Customer page', () => {
    cy.intercept('GET', '/services/crm/api/customers*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('customer');
    cy.wait('@entitiesRequest');
    if (startingEntitiesCount > 0) {
      cy.get(entityDetailsButtonSelector).first().click({ force: true });
      cy.getEntityDetailsHeading('customer');
      cy.get(entityDetailsBackButtonSelector).should('exist');
    }
    cy.visit('/');
  });

  it('should load create Customer page', () => {
    cy.intercept('GET', '/services/crm/api/customers*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('customer');
    cy.wait('@entitiesRequest');
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('Customer');
    cy.get(entityCreateSaveButtonSelector).should('exist');
    cy.visit('/');
  });

  it('should load edit Customer page', () => {
    cy.intercept('GET', '/services/crm/api/customers*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('customer');
    cy.wait('@entitiesRequest');
    if (startingEntitiesCount > 0) {
      cy.get(entityEditButtonSelector).first().click({ force: true });
      cy.getEntityCreateUpdateHeading('Customer');
      cy.get(entityCreateSaveButtonSelector).should('exist');
    }
    cy.visit('/');
  });

  it('should create an instance of Customer', () => {
    cy.intercept('GET', '/services/crm/api/customers*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('customer');
    cy.wait('@entitiesRequest');
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('Customer');

    cy.get(`[data-cy="firstName"]`).type('Melba', { force: true }).invoke('val').should('match', new RegExp('Melba'));

    cy.get(`[data-cy="lastName"]`).type('Sanford', { force: true }).invoke('val').should('match', new RegExp('Sanford'));

    cy.get(`[data-cy="gender"]`).select('OTHER');

    cy.get(`[data-cy="email"]`)
      .type('gw9bjukv@sfhdf.balx', { force: true })
      .invoke('val')
      .should('match', new RegExp('gw9bjukv@sfhdf.balx'));

    cy.get(`[data-cy="phone"]`)
      .type('689.575.7634 x79870', { force: true })
      .invoke('val')
      .should('match', new RegExp('689.575.7634 x79870'));

    cy.get(`[data-cy="addressLine1"]`).type('reboot', { force: true }).invoke('val').should('match', new RegExp('reboot'));

    cy.get(`[data-cy="addressLine2"]`).type('wireless', { force: true }).invoke('val').should('match', new RegExp('wireless'));

    cy.get(`[data-cy="city"]`).type('Lake Bryon', { force: true }).invoke('val').should('match', new RegExp('Lake Bryon'));

    cy.get(`[data-cy="country"]`).type('Croatia', { force: true }).invoke('val').should('match', new RegExp('Croatia'));

    cy.get(entityCreateSaveButtonSelector).click({ force: true });
    cy.scrollTo('top', { ensureScrollable: false });
    cy.get(entityCreateSaveButtonSelector).should('not.exist');
    cy.intercept('GET', '/services/crm/api/customers*').as('entitiesRequestAfterCreate');
    cy.visit('/');
    cy.clickOnEntityMenuItem('customer');
    cy.wait('@entitiesRequestAfterCreate');
    cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount + 1);
    cy.visit('/');
  });

  it('should delete last instance of Customer', () => {
    cy.intercept('GET', '/services/crm/api/customers*').as('entitiesRequest');
    cy.intercept('DELETE', '/services/crm/api/customers/*').as('deleteEntityRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('customer');
    cy.wait('@entitiesRequest').then(({ request, response }) => {
      startingEntitiesCount = response.body.length;
      if (startingEntitiesCount > 0) {
        cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount);
        cy.get(entityDeleteButtonSelector).last().click({ force: true });
        cy.getEntityDeleteDialogHeading('customer').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click({ force: true });
        cy.wait('@deleteEntityRequest');
        cy.intercept('GET', '/services/crm/api/customers*').as('entitiesRequestAfterDelete');
        cy.visit('/');
        cy.clickOnEntityMenuItem('customer');
        cy.wait('@entitiesRequestAfterDelete');
        cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount - 1);
      }
      cy.visit('/');
    });
  });
});
