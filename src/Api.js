import axios from "axios";
import Config from './config/Config';

class Api {
    static getUser() {
        return axios.get(`${Config.api()}user`);
    };

    static updateUser({username, companyName, fullName, street, zip, town, phone, email, ustrNr, bankname, iban, bic, taxOffice, taxUstrCheck, billNumberLogic}) {
        return axios.put(`${Config.api()}user`, {
            username, companyName, fullName, street, zip, town, phone, email, ustrNr, bankname, iban, bic, taxOffice, taxUstrCheck, billNumberLogic
        });
    };

    static addUser(username, password, repeatPassword) {
        return axios.post(`${Config.api()}user/register`, {
            username, password, repeatPassword
        });
    };

    static updatePassword(password, newPassword, repeatPassword) {
        return axios.put(`${Config.api()}user/password`, {
            password, newPassword, repeatPassword
        });
    };

    static getTaxData() {
        return axios.get(`${Config.api()}taxData`);
    };

    static getLastActivePage() {
        return axios.get(`${Config.api()}lastActivePage`)
    };
    static updateLastActivePage(lastActivePage) {
        return axios.put(`${Config.api()}lastActivePage/`, {
            lastActivePage
        })
    };

    static createTaxData(checkDate, checkDateIs) {
        return axios.post(`${Config.api()}taxData`, {
            checkDate, checkDateIs
        });
    };

    static updateTaxData(id, checkDate, checkDateIs) {
        return axios.put(`${Config.api()}taxData/${id}`, {
            checkDate, checkDateIs
        });
    };
    static deleteTaxData() {
        return axios.delete(`${Config.api()}taxData`)};

    static getDefaultTexts() {
        return axios.get(`${Config.api()}defaultTexts`);
    };
    static updateDefaultTexts(text1, text2) {
        return axios.put(`${Config.api()}defaultTexts/`, {
            text1, text2
        });
    };
    static getUserNotes() {
        return axios.get(`${Config.api()}userNotes`);
    };
    static updateUserNotes(notes) {
        return axios.put(`${Config.api()}userNotes/`, {
            notes
        });
    };
    static getValue(key) {
        return axios.get(`${Config.api()}${key}`);
    };
    static createCustomer(companyName, name, street, zip, town, text1, text2) {
        return axios.post(`${Config.api()}customer`, {
            companyName, name, street, zip, town, text1, text2
        });
    }
    static getCustomers() {
        return axios.get(`${Config.api()}customer`);
    };
    static updateCustomer(id, companyName, name, street, zip, town, text1, text2) {
        return axios.put(`${Config.api()}customer/${id}`, {
            companyName, name, street, zip, town, text1, text2
        });
    };
    static deleteCustomer(id) {
        return axios.delete(`${Config.api()}customer/${id}`)
    };


    static createBill(billNumber, billDate, billCustomerId, billCustomerCompanyName, billCustomerName, billCustomerStreet, billCustomerZip, billCustomerTown, billCustomerText1, billCustomerText2, positions, userCompanyName, userFullName, userStreet, userZip, userTown, userPhone, userEmail, userUstrNr, userBankname, userIban, userBic, userTaxOffice) {
        return axios.post(`${Config.api()}bill`, {
            billNumber, billDate, billCustomerId, billCustomerCompanyName, billCustomerName, billCustomerStreet, billCustomerZip, billCustomerTown, billCustomerText1, billCustomerText2, positions, userCompanyName, userFullName, userStreet, userZip, userTown, userPhone, userEmail, userUstrNr, userBankname, userIban, userBic, userTaxOffice
        });
    }

    static getBills() {
        return axios.get(`${Config.api()}bill`);
    };

    static updateBill(id, billNumber, billDate, billCustomerId, billCustomerCompanyName, billCustomerName, billCustomerStreet, billCustomerZip, billCustomerTown, billCustomerText1, billCustomerText2, positions, userCompanyName, userFullName, userStreet, userZip, userTown, userPhone, userEmail, userUstrNr, userBankname, userIban, userBic, userTaxOffice) {
        return axios.put(`${Config.api()}bill/${id}`, {
            billNumber, billDate, billCustomerId, billCustomerCompanyName, billCustomerName, billCustomerStreet, billCustomerZip, billCustomerTown, billCustomerText1, billCustomerText2, positions, userCompanyName, userFullName, userStreet, userZip, userTown, userPhone, userEmail, userUstrNr, userBankname, userIban, userBic, userTaxOffice
        });
    };

    static deleteBill(id) {
        return axios.delete(`${Config.api()}bill/${id}`)
    };

    static getBillPdf(id) {
        return axios.get(`${Config.api()}bill/render/${id}`, {
            headers: {
                authorization: `Bearer ${localStorage.getItem('bearertoken')}`
            },
            responseType: 'blob'
        });

    };
    static getTaxCalculation(startAndEndDates) {
        return axios.post(`${Config.api()}taxcalculation`, {
            startAndEndDates
        });
    };
}

export default Api;
