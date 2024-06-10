/// <reference types="Cypress" />

describe("Test Benefits Dashboard", () => {
    it("API testing", () => {
        const authToken = 'VGVzdFVzZXIzODQ6S1dbTjROY3lefEx7';

        cy.log("**POST Add Employee**")
        cy.request({
            method: 'POST',
            url: 'https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod/api/employees',
            headers: {
                'Authorization': `Basic ${authToken}`
              },
            body: {
                firstName: 'Dua',
                lastName: 'Lipa',
                dependants: 1
            },
        }).then((response) => {
            expect(response.status).to.equal(200);

            const newEmployeeId = response.body.id;

            expect(response.body).to.have.property('id', newEmployeeId);
            expect(response.body).to.have.property('firstName', 'Dua');
            expect(response.body).to.have.property('lastName', 'Lipa');
            expect(response.body).to.have.property('dependants', 1)

            cy.log("**PUT Update Employee**")
            cy.request({
                method: 'PUT',
                url: 'https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod/api/employees',
                headers: {
                    'Authorization': `Basic ${authToken}`
                  },
                body: {
                    firstName: 'Dua',
                    lastName: 'Smith',
                    dependants: 3,
                    id: newEmployeeId
                },
            }).then((response) => {
                expect(response.status).to.equal(200);
                expect(response.body).to.have.property('id', newEmployeeId);
                expect(response.body).to.have.property('firstName', 'Dua');
                expect(response.body).to.have.property('lastName', 'Smith');
                expect(response.body).to.have.property('dependants', 3)
            })

            cy.log("**DELETE Delete Employee**")
            cy.request({
                method: 'DELETE',
                url: `https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod/api/employees/${newEmployeeId}`,
                headers: {
                    'Authorization': `Basic ${authToken}`
                }
            }).then((response) => {
                expect(response.status).to.equal(200);
                
            })

            cy.request({
                method: 'GET',
                url: `https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod/api/employees/${newEmployeeId}`,
                headers: {
                    'Authorization': `Basic ${authToken}`
                }
            }).then((response) => {
                expect(response.status).to.equal(404);
                expect(response.body).to.not.have.property('id', newEmployeeId);
            })
        })
    })
})