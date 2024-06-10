/// <reference types="Cypress" />

describe("Test Benefits Dashboard", () => {

    it("Frontend functionality", () => {
        cy.uiLogin();

        cy.log("**Add Employee**")
        cy.get("#employeesTable").should("be.visible")

        let initialEmployeesRecords;
        cy.get("tbody tr").then($rows => {
            initialEmployeesRecords = $rows.length;
        })
        cy.intercept('POST', 'https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod/api/employees').as('getEmployees')
        
        cy.get("#add").should("be.visible").click();
        cy.get("#employeeModal").should("be.visible").within(() => {
            cy.get("#firstName").should("be.visible").click().type("John")
            cy.get("#lastName").should("be.visible").click().type("Doe")
            cy.get("#dependants").should("be.visible").click().type(1)
            cy.get("#addEmployee").should("be.visible").click()
        })

        cy.wait('@getEmployees').then((interception) => {
            const newEmployeeId = interception.response.body.id;

            cy.get("tbody tr").should("have.length", initialEmployeesRecords + 1)
            
            cy.get('table').contains('td', newEmployeeId).parent('tr').within(() => {
                cy.get('td').eq(1).should('contain', 'John');
                cy.get('td').eq(2).should('contain', 'Doe')
                cy.get('td').eq(3).should('contain', 1)
                cy.get('td').eq(6).should('contain', 57.69)
                cy.get('td').eq(7).should('contain', 1942.31)
            })

            cy.log("**Update details**")
            cy.get('table').contains('td', newEmployeeId).parent('tr').within(() => {
                cy.get(".fa-edit").click();
            })
            
            cy.get("#employeeModal").should("be.visible").within(() => {
                cy.get("#dependants").should("be.visible").click().clear().type(5);
                cy.get("#updateEmployee").should("be.visible").click();
            });

            cy.get('table').contains('td', newEmployeeId).parent('tr').within(() => {
                cy.get('td').eq(3).should('contain', 5)
                cy.get('td').eq(6).should('contain', 134.62)
                cy.get('td').eq(7).should('contain', 1865.38)
            });
        

            cy.log("**Delete Employee**")
            cy.get('table').contains('td', newEmployeeId).parent('tr').within(() => {
                cy.get(".fa-times").click();
            })
            cy.get("#deleteEmployee").should("be.visible").click();
            cy.get("tbody tr").should("have.length", initialEmployeesRecords)
        });
    });
});