// Wait until HTML fully loads
document.addEventListener("DOMContentLoaded", function () {

    // ===============================
    // District List (All 77 Districts)
    // ===============================
    const districts = [
        "Kathmandu","Lalitpur","Bhaktapur","Kaski","Chitwan","Jhapa",
        "Morang","Rupandehi","Dang","Kailali","Sunsari","Banke",
        "Bara","Parsa","Dhanusha","Saptari","Siraha","Udayapur",
        "Gorkha","Lamjung","Tanahun","Syangja","Parbat","Baglung",
        "Myagdi","Mustang","Manang","Dolpa","Humla","Jumla",
        "Kalikot","Mugu","Surkhet","Dailekh","Jajarkot","Rukum",
        "Salyan","Rolpa","Pyuthan","Kapilvastu","Arghakhanchi",
        "Palpa","Nawalpur","Nuwakot","Dhading","Rasuwa",
        "Sindhupalchok","Dolakha","Ramechhap","Sindhuli",
        "Makwanpur","Kavre","Okhaldhunga","Khotang",
        "Solukhumbu","Bhojpur","Dhankuta","Terhathum",
        "Taplejung","Panchthar","Ilam","Achham",
        "Bajura","Bajhang","Doti","Dadeldhura",
        "Darchula","Baitadi","Kanchanpur",
        "Mahottari","Sarlahi","Rautahat",
        "Western Rukum","Eastern Rukum",
        "Parasi","Gulmi"
    ];

    // Get elements
    const districtSelect = document.getElementById("district");
    const searchDistrictSelect = document.getElementById("searchDistrict");
    const donorList = document.getElementById("donorList");

    const firstNameInput = document.getElementById("firstName");
    const middleNameInput = document.getElementById("middleName");
    const lastNameInput = document.getElementById("lastName");
    
    const ageInput = document.getElementById("age");

    const phoneInput = document.getElementById("phone");
    const bloodSelect = document.getElementById("bloodGroup");
    const searchBlood = document.getElementById("searchBlood");

    let editId = null; // Used for edit mode

    // Populate districts dropdown
    districts.forEach(d => {
        districtSelect.innerHTML += `<option>${d}</option>`;
        searchDistrictSelect.innerHTML += `<option>${d}</option>`;
    });

    // Donor Class
    class Donor {
        constructor(firstName, middleName, lastName, age, phone, blood, district) {
            this.id = Date.now(); // Unique ID
            this.firstName = firstName;
            this.middleName = middleName;
            this.lastName = lastName;
            this.age = age;
     // Donor name
            this.phone = phone;   // Phone number
            this.blood = blood;   // Blood group
            this.district = district; // District
            this.date = new Date().toLocaleString(); // Auto date/time
        }
    }

    // Get donors from localStorage
    function getDonors() {
        return JSON.parse(localStorage.getItem("donors")) || [];
    }

    // Save donors to localStorage
    function saveDonors(donors) {
        localStorage.setItem("donors", JSON.stringify(donors));
    }

    // Add or Update Donor
    window.addDonor = function () {

        const firstName = firstNameInput.value.trim();
        const middleName = middleNameInput.value.trim();
        const lastName = lastNameInput.value.trim();
        const age = ageInput.value.trim();

        const phone = phoneInput.value.trim();
        const blood = bloodSelect.value;
        const district = districtSelect.value;

        // Validation
        // if (!firstName || !lastName || !age || !phone || !blood || !district) {
        //     alert("Please fill all fields!");
        //     return;
        // }

        // if (phone.length < 10) {
        //     alert("Phone number must be at least 10 digits!");
        //     return;
        // }

        const donors = getDonors();

        // Edit Mode
        if (editId) {
            const index = donors.findIndex(d => d.id === editId);
            donors[index].name = name;
            donors[index].phone = phone;
            donors[index].blood = blood;
            donors[index].district = district;
            editId = null;
        } else {
            const donor = new Donor(firstName, middleName, lastName, age, phone, blood, district);
            donors.push(donor);
        }

        saveDonors(donors);
        clearForm();
        displayDonors();
    };

    // Display Donors
    function displayDonors() {
        donorList.innerHTML = "";
        const donors = getDonors();

        donors.forEach(d => {
            donorList.innerHTML += `
                <div class="bg-white p-5 rounded-xl shadow-lg">
                    <h4 class="text-xl font-bold text-red-600">
                    ${d.firstName} ${d.middleName ? d.middleName : ""} ${d.lastName} 
                    </h4>
                    <p>Age: ${d.age}</p>
                    <p>Phone no: ${d.phone}</p>
                    <p>Blood group: ${d.blood}</p>
                    <p>District: ${d.district}</p>
                    <p class="text-sm text-gray-500">${d.date}</p>
                    <div class="flex gap-2 mt-3">
                        <button onclick="editDonor(${d.id})"
                            class="bg-yellow-500 text-white px-3 py-1 rounded">
                            Edit
                        </button>
                        <button onclick="deleteDonor(${d.id})"
                            class="bg-red-600 text-white px-3 py-1 rounded">
                            Delete
                        </button>
                    </div>
                </div>
            `;
        });
    }

    // Delete Donor
    window.deleteDonor = function (id) {
        const donors = getDonors().filter(d => d.id !== id);
        saveDonors(donors);
        displayDonors();
    };

    // Edit Donor
    window.editDonor = function (id) {
        const donor = getDonors().find(d => d.id === id);
        firstNameInput.value = donor.firstName;
        middleNameInput.value = donor.middleName;
        lastNameInput.value = donor.lastName;
        
        ageInput.value = donor.age;

        phoneInput.value = donor.phone;
        bloodSelect.value = donor.blood;
        districtSelect.value = donor.district;
        editId = id;
    };

    // Clear Form
    function clearForm() {
        firstNameInput.value = "";
        middleNameInput.value = "";
        lastNameInput.value = "";
       
        ageInput.value = "";

        phoneInput.value = "";
        bloodSelect.value = "";
        districtSelect.value = "";
    }

    // Search Donor
    window.searchDonor = function () {
        const blood = searchBlood.value;
        const district = searchDistrictSelect.value;

        const filtered = getDonors().filter(d =>
            (blood === "" || d.blood === blood) &&
            (district === "" || d.district === district)
        );

        donorList.innerHTML = "";

        filtered.forEach(d => {
            donorList.innerHTML += `
                <div class="bg-white p-5 rounded-xl shadow-lg">
                    <h4 class="text-xl font-bold text-red-600">${d.name}</h4>
                    <p>Age: ${d.age}</p>
                    <p>Phone no: ${d.phone}</p>
                    <p>Blood group:  ${d.blood}</p>
                    <p>District: ${d.district}</p>
                </div>
            `;
        });
    };

    // Initial display
    displayDonors();

});
