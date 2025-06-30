'use strict';

console.log('Hello world'); // basic log

window.validateLogin = function () {
    const role = document.getElementById("loginRole").value;
    const password = document.getElementById("loginPassword").value;

    const credentials = {
        Director: "Director",
        Manager: "Manager",
        Employee: "Employee"
    };

    if (credentials[role] === password) {
        currentUserRole = role;
        document.getElementById("loginsection").style.display = "none";
        document.getElementById("main-content").style.display = "block";
        populateSalaryTypeOptions();
    } else {
        alert("Invalid credentials. Please try again.");
    }
};

function validateSignin() {
    document.getElementById("Newementry").style.display = "block";
    document.getElementById("main-content").style.display = "block";
    document.getElementById("loginsection").style.display = "none";

    const designationType = document.getElementById("ne_type").value.trim();
    const firstname = document.getElementById("ne_fname").value.trim();
    const lastname = document.getElementById("ne_lname").value.trim();
    const employeeid = document.getElementById("ne_eid").value.trim();
    const phonenum = document.getElementById("lp_enum").value.trim();
    const manname = document.getElementById("ne_incman").value.trim();
    const manemail = document.getElementById("ne_incmanmail").value.trim();
    const output = document.getElementById("output");

    if (!designationType || !firstname || !lastname || !employeeid || !phonenum || !manname || !manemail) {
        alert("Please fill all required fields for employee sign-in.");
        return;
    }

    output.innerHTML = `
    <strong>Designation Type:</strong> ${designationType}<br>
    <strong>Employee Name:</strong> ${firstname} ${lastname}<br>
    <strong>Employee ID:</strong> ${employeeid}<br>
    <strong>Phone Number:</strong> ${phonenum}<br>
    <strong>Manager Name:</strong> ${manname}<br>
    <strong>Manager Email ID:</strong> ${manemail}<br>
  `;

    output.style.display = "block";
}


let currentUserRole = "";

function populateSalaryTypeOptions() {
    const salarySelect = document.getElementById("salarytype");
    salarySelect.innerHTML = "";

    if (currentUserRole === "Director" || currentUserRole === "Manager") {
        salarySelect.innerHTML = `
        <option value="daysalary">Day Salary Calculation</option>
        <option value="monthsalary">Monthly Salary Calculation</option>
        <option value="leavereq">Leave Request</option>
      `;
    } else {
        salarySelect.innerHTML = `<option value="leavereq">Leave Request</option>`;
    }

    salarySelect.value = salarySelect.options[0].value;
    toggleEPFETFFields();
}

function toggleEPFETFFields() {
    const type = document.getElementById("salarytype").value;
    document.getElementById("pfFields").style.display = (type === "monthsalary") ? "block" : "none";
    document.getElementById("nonpfFields").style.display = (type === "daysalary") ? "block" : "none";
    document.getElementById("leavefields").style.display = (type === "leavereq") ? "block" : "none";
}

function toggleLeaveInputs() {
    const type = document.getElementById("leavetype").value;
    document.getElementById("leave-date-fields").style.display = (type === "day") ? "block" : "none";
    document.getElementById("leave-time-fields").style.display = (type === "shorttime") ? "block" : "none";
}

function calculateSalary() {
    const type = document.getElementById("salarytype").value;
    const name = document.getElementById("name").value;
    const output = document.getElementById("output");

    if (!name) {
        alert("Please enter employee name.");
        return;
    }

    if (type === "monthsalary") {
        const basic = parseFloat(document.getElementById("month_basic").value);
        const allowance = parseFloat(document.getElementById("allowance").value);
        const deduction = parseFloat(document.getElementById("month_deduction").value);
        const epf = parseFloat(document.getElementById("epf").value);
        const etf = parseFloat(document.getElementById("etf").value);
        const taxPercent1 = parseFloat(document.getElementById("tax1").value);
        const taxPercent2 = parseFloat(document.getElementById("tax2").value);
        const taxPercent3 = parseFloat(document.getElementById("tax3").value);
        const memailid = document.getElementById("mem_emailid").value;
        const mmaemailid = document.getElementById("mma_emailid").value;

        if ([basic, allowance, deduction, epf, etf, taxPercent1, taxPercent2, taxPercent3].some(isNaN)) {
            alert("Please fill all monthly salary fields with valid numbers.");
            return;
        }

        let tax1Amount = 0, tax2Amount = 0, tax3Amount = 0;

        if (basic > 10000 && basic <= 20000) {
            tax1Amount = (basic - 10000) * (taxPercent1 / 100);
        } else if (basic > 20000 && basic <= 30000) {
            tax1Amount = 10000 * (taxPercent1 / 100);
            tax2Amount = (basic - 20000) * (taxPercent2 / 100);
        } else if (basic > 30000) {
            tax1Amount = 10000 * (taxPercent1 / 100);
            tax2Amount = 10000 * (taxPercent2 / 100);
            tax3Amount = (basic - 30000) * (taxPercent3 / 100);
        }

        const totalTax = tax1Amount + tax2Amount + tax3Amount;
        const epfAmount = (epf / 100) * basic;
        const etfAmount = (etf / 100) * basic;
        const gross = basic + allowance;
        const net = gross - deduction - epfAmount - etfAmount - totalTax;

        output.innerHTML = `
        <strong>Employee Name:</strong> ${name}<br>
        <strong>Gross Salary:</strong> LKR ${gross.toFixed(2)}<br>
        <strong>EPF Deduction (${epf}%):</strong> LKR ${epfAmount.toFixed(2)}/=<br>
        <strong>ETF Deduction (${etf}%):</strong> LKR ${etfAmount.toFixed(2)}/=<br>
        <strong>TAX1:</strong> LKR ${tax1Amount.toFixed(2)}/=<br>
        <strong>TAX2:</strong> LKR ${tax2Amount.toFixed(2)}/=<br>
        <strong>TAX3:</strong> LKR ${tax3Amount.toFixed(2)}/=<br>
        <strong>Other Deductions:</strong> LKR ${deduction.toFixed(2)}/=<br>
        <strong>Net Salary:</strong> LKR ${net.toFixed(2)}/=<br>
        <strong>Employee Email Id:</strong> ${memailid}<br>
        <strong>Manager Email Id:</strong> ${mmaemailid}<br>
      `;
        const subject = `Monthly Salary Amount For ${name}`;
        const body = `Dear ${name},\nThis Is Your Monthly Salary Summary\n\nEmployee Name: ${name}\nEPF: ${epfAmount.toFixed(2)}/=\nETF: ${etfAmount.toFixed(2)}/=\nDeduction Amount: LKR ${deduction.toFixed(2)}/=\nNet Salary: LKR ${net.toFixed(2)}/=\n`;

        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(memailid)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(gmailUrl, '_blank');


    } else if (type === "daysalary") {
        const basic = parseFloat(document.getElementById("day_basic").value);
        const days = parseFloat(document.getElementById("daysofworked").value);
        const hours = parseFloat(document.getElementById("hoursofworked").value);
        const deduction = parseFloat(document.getElementById("day_deduction").value);
        const emailid = document.getElementById("em_emailid").value;
        const maemailid = document.getElementById("ma_emailid").value;

        if ([basic, days, hours, deduction].some(isNaN) || !emailid || !maemailid) {
            alert("Please fill all daily salary fields with valid data.");
            return;
        }

        const gross = (basic * days) + (basic / 8) * hours;
        const net = gross - deduction;

        output.innerHTML = `
        <strong>Employee Name:</strong> ${name}<br>
        <strong>Daily Rate:</strong> LKR ${basic.toFixed(2)}<br>
        <strong>Worked Days:</strong> ${days}<br>
        <strong>Worked Hours:</strong> ${hours}<br>
        <strong>Gross Salary:</strong> LKR ${gross.toFixed(2)}<br>
        <strong>Deductions:</strong> LKR ${deduction.toFixed(2)}<br>
        <strong>Employee Email Id:</strong> ${emailid}<br>
        <strong>Manager Email Id:</strong> ${maemailid}<br>
        <strong>Net Salary:</strong> <strong>LKR ${net.toFixed(2)}</strong>
      `;

        const subject = `Day Salary Amount For ${name}`;
        const body = `Dear ${emailid},\n\nThis Is Your Day Salary Summary\n\nEmployee Name: ${name}\nDay Rate: ${basic}\nWorked Days: ${days}\nWorked Hours: ${hours}\n\nNet Salary: LKR ${net.toFixed(2)}\n`;

        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(emailid)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(gmailUrl, '_blank');

    } else if (type === "leavereq") {
        const managerEmail = document.getElementById("l_incmanmail").value;
        const empId = document.getElementById("l_id").value;
        const empName = document.getElementById("lf_name").value;
        const leaveType = document.getElementById("leavetype").value;
        const reason = document.getElementById("l_leavereason").value;
        const contact = document.getElementById("lp_num").value;

        let duration = "";
        if (leaveType === "day") {
            duration = `From ${document.getElementById("l_leaveperied1").value} to ${document.getElementById("l_leaveperied2").value}`;
        } else {
            duration = document.getElementById("l_leaveperied_time").value;
        }

        if (!managerEmail || !empId || !empName || !duration || !reason) {
            alert("Please fill all required leave request fields.");
            return;
        }

        const subject = `Leave Request from ${empName}`;
        const body = `Dear ${document.getElementById("l_incman").value},\n\nI would like to request ${leaveType} leave.\n\nEmployee ID: ${empId}\nName: ${empName}\nContact: ${contact}\nDuration: ${duration}\nReason: ${reason}\n\nThank you.`;

        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(managerEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(gmailUrl, '_blank');
    }

    output.style.display = (type !== "leavereq") ? "block" : "none";
}

function clearForm() {
    // Clear all input and select fields
    document.querySelectorAll('input, select, textarea').forEach(el => {
        if (el.type === 'select-one') {
            el.selectedIndex = 0;
        } else {
            el.value = '';
        }
    });

    // Hide conditional sections
    // document.getElementById("pfFields").style.display = "none";
    //document.getElementById("nonpfFields").style.display = "none";
    //document.getElementById("leavefields").style.display = "none";
    //document.getElementById("Newementry").style.display = "none";
    //document.getElementById("leave-date-fields").style.display = "block";
    //document.getElementById("leave-time-fields").style.display = "none";

    // Hide output section
    document.getElementById("output").style.display = "none";
}

function togglePasswordVisibility() {
    const passwordInput = document.getElementById("loginPassword");
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";
}

function loginsection() {
    document.getElementById("main-content").style.display = "none";
    document.getElementById("loginsection").style.display = "block";
    clearForm();
}

document.addEventListener("DOMContentLoaded", () => {
    toggleEPFETFFields();
});

