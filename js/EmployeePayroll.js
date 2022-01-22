let employeePayrollObj = {};
let isUpdate = false;
window.addEventListener('DOMContentLoaded', (event) => {
    salaryOutput();
    validateName();
    validateDate();
    checkForUpdate();
});

function validateName() {
    const name = document.querySelector("#name");
    const textError = document.querySelector(".text-error");
    name.addEventListener('input', function() {
        if (name.value.length == 0) {
            textError.textContent = "";
            return;
        }
        try {
            (new EmployeePayrollData()).name = name.value;;
            textError.textContent = "";
        } catch (e) {
            console.error(e)
            textError.textContent = e;
        }
    });
}

function checkDate() {
    console.log("checking Date");
    const dateError = document.querySelector('.date-error');
    try {
        let date = day.value + " " + month.value + " " + year.value;
        (new EmployeePayrollData()).startDate = new Date(Date.parse(date));
        dateError.textContent = "";
    } catch (e) {
        console.error(e);
        dateError.textContent = e;
    }
}

function validateDate() {
    console.log("validating Date");
    const day = document.querySelector('#day');
    const month = document.querySelector('#month');
    const year = document.querySelector('#year');
    day.addEventListener('input', checkDate);
    month.addEventListener('input', checkDate);
    year.addEventListener('input', checkDate);

}
const salaryOutput = () => {
    const salary = document.querySelector('#salary');
    const output = document.querySelector('.salary-output');
    output.textContent = salary.value;
    salary.addEventListener('input', function() {
        output.textContent = salary.value;
    });
}


//    uc--3

const save = () => {
    console.log("save");

    try {
        let employeePayrollData = createEmployeePayroll();
        createAndUpdateStorage(employeePayrollData);
    } catch (e) {
        console.log(e);
    }
}

const createEmployeePayroll = () => {
    let employeePayrollData = new EmployeePayrollData();
    try {
        employeePayrollData._name = getInputValueById('#name');

    } catch (e) {
        setTextValue('.text-error', e);
        throw e;
    }
    employeePayrollData._id = new Date().getTime();

    employeePayrollData._profilePic = getSelectedValues('[name=profile]').pop();
    employeePayrollData._gender = getSelectedValues('[name=gender]').pop();
    employeePayrollData._department = getSelectedValues('[name=department]');
    employeePayrollData._salary = getInputValueById('#salary');
    employeePayrollData._note = getInputValueById('#notes');
    let date = getInputValueById('#day') + " " + getInputValueById('#month') + " " + getInputValueById('#year');
    try {
        employeePayrollData.startDate = new Date(date);
    } catch (error) {
        setTextValue('#startDate', 'error');
        throw error;
    }

    alert(employeePayrollData.toString());
    return employeePayrollData;
}

const getSelectedValues = (propertyValue) => {
    let allItems = document.querySelectorAll(propertyValue);
    let setItems = [];
    allItems.forEach(item => {
        if (item.checked) setItems.push(item.value);
    });
    return setItems;
}

const getInputValueById = (id) => {
    let value = document.querySelector(id).value;
    return value;
}

const getInputElementValue = (id) => {
    let value = document.getElementsById(id).value;
    return value;
}

// uc---4
function createAndUpdateStorage(employeePayrollData) {
    let employeePayrollList = JSON.parse(localStorage.getItem("EmployeePayrollList"));
    if (employeePayrollList != undefined) {
        employeePayrollList.push(employeePayrollData);
    } else {
        employeePayrollList = [employeePayrollData]
    }
    alert(employeePayrollList.toString());
    localStorage.setItem("EmployeePayrollList", JSON.stringify(employeePayrollList))
}

// const createEmployeePayrollid = () => {
//     let employeePayrollid = localStorage.getItem("EmpId");
//     employeePayrollid = !employeePayrollid ? 1 : (parseInt(employeePayrollid) + 1).toString();
//     localStorage.setItem("EmployeePayrollid", employeePayrollid);
//     return employeePayrollid;
// }

const resetForm = () => {
    console.log("resetting...");
    setValue('#name', '');
    const nameError = document.querySelector(".text-error");
    nameError.textContent = '';
    unsetSelectedValues('[name=profile]');
    unsetSelectedValues('[name=gender]');
    unsetSelectedValues('[name=department]');
    setValue('#salary', '400000');
    const output = document.querySelector('.salary-output');
    output.textContent = '400000';
    setValue('#notes', '');
    setValue('#day', '');
    setValue('#month', '');
    setValue('#year', '');
    const dateError = document.querySelector('.date-error');
    dateError.textContent = '';

}
const unsetSelectedValues = (propertyValue) => {
    let allItems = document.querySelectorAll(propertyValue);
    allItems.forEach(item => {
        item.checked = false;
    });
}

const setTextValue = (id, value) => {
    const element = document.querySelectorAll(id);
    element.textContent = value;
}
const setValue = (id, value) => {
    const element = document.querySelector(id);
    element.value = value;
}

const remove = (node) => {
    console.log("remove");
    let empPayrollData = empPayrollList.find(empData => empData._id == node.id);
    if (!empPayrollData) return;
    const index = empPayrollList
        .map(empData => empData._id)
        .indexOf(empPayrollData._id);
    empPayrollList.splice(index, 1);
    localStorage.setItem("EmployeePayrollList", JSON.stringify(empPayrollList));
    document.querySelector(".emp-count").textContent = empPayrollList.length;
    createInnerHtml();
}


const checkForUpdate = () => {
    console.log("checkForUpdate");
    const employeePayrollJson = localStorage.getItem('editEmp');
    isUpdate = employeePayrollJson ? true : false;
    if (!isUpdate) {
        return;
    }
    employeePayrollObj = JSON.parse(employeePayrollJson);
    setForm(employeePayrollJson._id);
}


const update = (node) => {
    let employeePayrollData = empPayrollList.find(empData => empData._id == node._id);
    // if (!employeePayrollData) return;
    localStorage.setItem('editEmp', JSON.stringify(employeePayrollData))
    window.location.replace("../html/addEmployee.html");
}

const setForm = () => {
    setValue('#name', employeePayrollObj._name);
    setSelectedValues('[name = profile]', employeePayrollObj._profilePic);
    setSelectedValues('[name = gender]', employeePayrollObj._gender);
    setSelectedValues('[name = department]', employeePayrollObj._department);
    setValue('#salary', employeePayrollObj._salary);
    setTextValue('.salary-output', employeePayrollObj._salary);

    let date = stringifyDate(employeePayrollObj._startDate).split(" ");
    setValue('#day', date[0]);
    setValue('#month', date[1]);
    setValue('#year', date[2]);
    console.log(employeePayrollObj._note);
    setValue('#notes', employeePayrollObj._note);
}

const setSelectedValues = (propertyValue, value) => {
    let allItems = document.querySelectorAll(propertyValue);
    allItems.forEach(item => {
        if (Array.isArray(value)) {
            if (value.includes(item.value)) {
                item.checked = true;
            }
        } else if (item.value === value)
            item.checked = true;
    });
}