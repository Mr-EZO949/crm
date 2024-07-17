

(function(){
    let clientsContacts = [];
    let socialsInputList = [];
    const maskOptions = {
        mask: '+{7}(000)000-00-00'
      };
    const changeFormValidator = new JustValidate('#changeForm');
    async function deleteStudent(studentId){
        const response = await fetch(`http://localhost:3000/api/clients/${studentId}`, {
            method: 'DELETE',
        })
        window.location.reload();
        return response.ok;
    }

    async function changeStudentInDb(student, studentInfo){
        let studentId = student.id;
        console.log(studentId);
        const response = await fetch(`http://localhost:3000/api/clients/${studentId}`, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(studentInfo),
        })
        const data = await response.json();
        window.location.reload();
        console.log(data);
    }

    function createEditButton(student, changeForm){
        
        let editButton = document.createElement('button');
        editButton.classList.add('edit-button');
        editButton.innerHTML = "Изменить";
        const modalContentChange = document.querySelector('.modal-change');
        
        editButton.addEventListener('click', function(){
            
            const idHeading = document.querySelector('.edit-id');
            idHeading.innerHTML = student.id;
            if(changeForm.classList.length === 1){
                for(let input of changeForm){
                    if(input.type === 'text'){
                        // console.log(input.id);
                        switch(input.id){
                            case 'changeName':
                                input.value = student.name;
                                break;
                            case 'changeSurname':
                                input.value = student.surname;
                                break;
                            case 'changeLastName':
                                input.value = student.lastName;
                                break;
                        }
                    }
                    // if(input.type === 'button'){
    
                    // }
                }
                for(let i in clientsContacts){
                    if(student.id === clientsContacts[i].id){
                        console.log(student.id);
                        for(let j in clientsContacts[i].currClient){
                            let socialsOptions = createSocialsOptions();
                            console.log(socialsOptions);
                            for(let option of socialsOptions.childNodes){
                                if(option.value === clientsContacts[i].currClient[j].type){
                                    
                                    option.selected = true;
                                    let socialsInputWrapper = document.createElement('div');
                                    const socialsInput = document.createElement('input');
                                    socialsInput.value = clientsContacts[i].currClient[j].value;
                                    
                                    socialsInput.placeholder = 'Введите данные контакта';
                                    const removeSocialButton = document.createElement('button');
                                    removeSocialButton.classList.add("remove-social");
                                    removeSocialButton.type = 'button';
                                    removeSocialButton.addEventListener("click", function(){
                                        socialsInputWrapper.remove();
                                        clientsContacts[i].currClient.splice(j, 1);
                                        socialsInputList.splice(j, 1);
                                        
                                    });
                                    socialsInputWrapper.classList.add('socials-wrapper');
                                    socialsInputWrapper.appendChild(socialsOptions);
                                    socialsInputWrapper.appendChild(socialsInput);
                                    socialsInputWrapper.appendChild(removeSocialButton);
                                    customSelect(socialsOptions);
                                    socialsInput.id = option.value;
                                    applyMaskToInputs()
                                    socialsOptions.onchange = () => {
                                        socialsInput.id = socialsOptions.value
                                        applyMaskToInputs()
                                    }
                                    socialsOptions.classList.add("custom-select")
                                    const addButton = document.getElementById("changeSocial");
                                    modalContentChange.insertBefore(socialsInputWrapper, addButton);
                                    let inputObject = {'socialsOptions':socialsOptions, 'socialsInput':socialsInput}
                                    socialsInputList.push(inputObject);
                                    applyMaskToInputs()
                                }
                                
                            }
                        }
                    }
                }
            }
            else{
                let wrapperList = document.querySelectorAll('.socials-wrapper');
                for(let wrap of wrapperList) {
                    console.log(wrap);
                    wrap.remove();
                }
            }
            const closeChangeFormButton = document.querySelector('.close-change');
            
            changeFormValidator.addField(document.querySelector("#changeName"), [
                {
                    rule: 'required',
                },
                {
                    rule: 'minLength',
                    value: 3,
                },
                {
                    rule: 'maxLength',
                    value: 17,
                },
            ]).addField(document.querySelector("#changeSurname"), [
                {
                    rule: 'required',
                },
                {
                    rule: 'minLength',
                    value: 3,
                },
                {
                    rule: 'maxLength',
                    value: 15,
                },
            ])
            changeFormValidator.onSuccess(function(e){
                let contacts = [];
                e.preventDefault();
                const name = document.getElementById('changeName').value.trim();
                const surname = document.getElementById('changeSurname').value.trim();
                const lastName = document.getElementById('changeLastName').value.trim();
                for(let input of socialsInputList){
                
                    let contact = {'type': input.socialsOptions.value, 'value': input.socialsInput.value};
                    contacts.push(contact);
                }
                if(contacts.length === 0) contacts = student.contacts;
                let studentInfo = {'name': name, 'surname': surname, 'lastName':lastName, 'contacts': contacts}
                // console.log(`created edit button for student ${student.id}`)
                changeStudentInDb(student, studentInfo);
                changeForm.reset();
                changeForm.classList.remove('show-modal-form')
                
            })
            closeChangeFormButton.addEventListener('click', function(){
                socialsInputList = [];
                // let modalContentChangeCopy = modalContentChange;
                // console.log(modalContentChange.childNodes);
                for(let child of document.querySelectorAll('.socials-wrapper')){
                    // console.log(child);
                    // console.log(child.className);
                    child.remove();
                    
                }
                changeForm.classList.remove('show-modal-form');
                window.location.reload();
            })
            
            changeForm.classList.add('show-modal-form');
        });
        
        

        return editButton;
    }

    function createDeleteButton(student){
        let deleteButton = document.createElement('button');
            
        deleteButton.innerHTML = "Удалить";
        
        deleteButton.classList.add('delete-button');

        

        deleteButton.addEventListener('click', function(){
            const deleted = deleteStudent(student.id);
            console.log(`Deleted student: ${deleted}`);
        })
        return deleteButton;
    }

    function createOption(text, value){
        const option = document.createElement('option');
        option.innerHTML = text;
        option.value = value;
        return option;
    }

    function createSocialsOptions(){
        
        const socialsOptions = document.createElement('select');
        const optionVk = createOption("Vk", 'vk');
        const optionNumber = createOption("Телефон", 'number');
        const optionEmail = createOption("Email", 'email');
        const optionFacebook = createOption('Facebook', 'facebook');
        const optionAddNum = createOption("Доп. Телефон", 'addNumber');

        socialsOptions.appendChild(optionVk);
        socialsOptions.appendChild(optionNumber);
        socialsOptions.appendChild(optionEmail);
        socialsOptions.appendChild(optionFacebook);
        socialsOptions.appendChild(optionAddNum);
    
        return socialsOptions;        
    }

    function drawStudent(student){
        let tbody = document.querySelector('.table-body');
        let tr = document.createElement('tr');

        // ID
        let tdID = document.createElement('td');
        let id = student.id
        tdID.classList.add("id-cell");
        tdID.innerHTML = id;
        tr.appendChild(tdID);

        // Full Name
        let tdFIO = document.createElement('td');
        tdFIO.innerHTML = `${student.surname} ${student.name} ${student.lastName}`
        tdFIO.classList.add('full-name');
        tr.appendChild(tdFIO);

        // Created time
        let tdCreatedTime = document.createElement('td');
        const createdDate = student.createdAt.slice(0, 10);
        const createdTime = student.createdAt.slice(11, 16);
        const created = `${createdDate} <span class="created-time-clock">${createdTime}</span>`;
        tdCreatedTime.classList.add("created-time");
        tdCreatedTime.innerHTML = created;
        tr.append(tdCreatedTime);

        // Updated At
        let tdUpdatedTime = document.createElement('td');
        const updateDate = student.updatedAt.slice(0, 10);
        const updatedTime = student.updatedAt.slice(11, 16);
        const updated = `${updateDate} <span class="updated-time-clock">${updatedTime}</span>`;
        tdUpdatedTime.classList.add("updated-time");
        tdUpdatedTime.innerHTML = updated;
        tr.append(tdUpdatedTime);

        // Contacts
        let tdContacts = document.createElement('td');
        tdContacts.classList.add('contacts-td');
        for(let contact of student.contacts){
            let tooltip = document.createElement('span');
            let link = document.createElement('a');
            link.href=`https://${contact.value}`;
            link.classList.add(`${contact.type}`);
            link.appendChild(tooltip);
            tooltip.classList.add("tooltip");
            tooltip.innerHTML = contact.value;
            // link.innerHTML = contact.type;
            tdContacts.appendChild(link);
        }
        tdContacts.classList.add("contacts-wrap");
        tr.appendChild(tdContacts);

        let tdActions = document.createElement('td');
        tdActions.classList.add("actions-wrap");

        const changeForm = document.getElementById("changeForm");
        const editButton = createEditButton(student, changeForm);
        const deleteButton = createDeleteButton(student);
        editButton.classList.add("edit-button");
        deleteButton.classList.add("delete-button");
        
        tdActions.appendChild(editButton);
        tdActions.appendChild(deleteButton);
        tr.appendChild(tdActions);
        tbody.append(tr);
        // console.log(tr);
    }

    function sortByName(data){
        data.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
        return data;
    }

    function sortById(data){
        data.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
        return data;
    }

    function sortByCreatedTime(data){
        data.sort((a,b) => (a.createdAt > b.createdAt) ? 1 : ((b.createdAt > a.createdAt) ? -1 : 0));
        return data;
    }
    
    function sortByEditedTime(data){
        data.sort((a,b) => (a.updatedAt > b.updatedAt) ? 1 : ((b.updatedAt > a.updatedAt) ? -1 : 0));
        return data;
    }

    async function addStudentToDb(student){
        let response = await fetch('http://localhost:3000/api/clients', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(student),
        });
        let data = response.json();
        console.log(data);
        window.location.reload();
    }

    function drawTable(data){
        for(let i in data){
            let currClient = data[i].id;
            // console.log(currClient);
            let currContacts = {'id': currClient, currClient : data[i].contacts};
            clientsContacts.push(currContacts);
            clientsContacts = removeDuplicates(clientsContacts);
            drawStudent(data[i]);
        }
    }

    function redrawTable(data){
        for(let i in data){
            
            drawStudent(data[i]);
        }
    }

    function applyMaskToInputs() {
        
        document.querySelectorAll('.socials-wrapper input').forEach(function(input) {
            if (input.mask) {
                input.mask.destroy();
            }
            if (input.id === 'number' || input.id === 'addNumber') {
                const mask = IMask(input, maskOptions);
                input.mask = mask;
                mask.updateValue();
            }
            else if(input.id === 'vk'){
                const mask = IMask(input, 
                    {
                        mask: 'https://vk.com/[aaaaaaaa]'
                    }
                );
                input.mask = mask;
                mask.updateValue()
            }
            else if(input.id === 'facebook'){
                const mask = IMask(input, 
                    {
                        mask: 'https://facebook.com/[aaaaaaaa]'
                    }
                );
                input.mask = mask;
                mask.updateValue()
            }
            else if(input.id === 'email'){
                const mask = IMask(input, 
                    {
                      mask: /^\S*@?\S*$/
                    }
            );
            input.mask = mask;
            mask.updateValue()
            }
        });
    }

    function removeDuplicates(list){
        return [...new Set(list)];
    }

    function filter(searchInput, data){
        let filterData = [];
        document.querySelector('.table-body').innerHTML = "";
        for(let client of data){
            const fio = (client.name + client.surname + client.lastName).toLowerCase().trim();
            
            if(fio.includes(searchInput.value.toLowerCase().trim()) || client.id.includes(searchInput.value.toLowerCase().trim())) filterData.push(client);
        }
        redrawTable(filterData);
    }
    
    async function createApp(){
        
        const response = await fetch('http://localhost:3000/api/clients');
        let data = await response.json();
        
        console.log(data);
        if(data.length > 0){
            drawTable(data);
        }
        // console.log(`All clients: ${clientsContacts[0].currClient[0].type}`);
        // console.log(Object.keys(clientsContacts[0]));
        const btn = document.getElementById('addPerson');
        const form = document.getElementById('form');
        // const changeForm = document.getElementById('changeForm');
        
        const validator = new JustValidate('#form');
        
        validator.addField(document.querySelector('#name'), [
            {
              rule: 'required',
            },
            {
              rule: 'minLength',
              value: 3,
            },
            {
              rule: 'maxLength',
              value: 15,
            },
          ]).addField(document.querySelector('#surname'), [
            {
              rule: 'required',
            },
            {
              rule: 'minLength',
              value: 3,
            },
            {
              rule: 'maxLength',
              value: 15,
            },
          ])
        const changeSocial = document.getElementById('changeSocial');
        changeSocial.addEventListener('click', function(){
            let socialsInputWrapper = document.createElement('div');
            const socialsOptions = createSocialsOptions();
            const socialsInput = document.createElement('input');
            const removeSocialButton = document.createElement('button');
            removeSocialButton.classList.add("remove-social");
            removeSocialButton.type = 'button';
            removeSocialButton.addEventListener("click", function(){
                socialsInputWrapper.remove();
                if (socialsInputList.length === 10) {
                    addButton.style.display = "block"; // Show the "Add Contact" button if contacts are less than 10
                }
            })

            socialsInput.placeholder = 'Введите данные контакта';
            socialsInputWrapper.classList.add('socials-wrapper');
            socialsInputWrapper.appendChild(socialsOptions);
            customSelect(socialsOptions);
            socialsOptions.classList.add("custom-select")
            socialsInputWrapper.appendChild(socialsInput);
            socialsInputWrapper.appendChild(removeSocialButton);
            console.log(socialsInputWrapper);
            socialsInput.id = socialsOptions.value;
            applyMaskToInputs()
            socialsOptions.onchange = () => {
                socialsInput.id = socialsOptions.value;
                applyMaskToInputs()
            }
            const addButton = document.getElementById("changeSocial");
            modalContentChange.insertBefore(socialsInputWrapper, addButton);
            let inputObject = {'socialsOptions':socialsOptions, 'socialsInput':socialsInput}
            socialsInputList.push(inputObject);
            if (socialsInputList.length === 10) {
                addButton.style.display = "none"; // Hide the "Add Contact" button if contacts reach 10
            }
            document.querySelectorAll('.socials-wrapper input').forEach(function(input) {
                console.log(input);
                changeFormValidator.addField(input, [
                    {
                        rule: 'required',
                    },
                    {
                        rule: 'minLength',
                        value: 17
                    }
                ]);
            });
        });
        const modalContentChange = document.querySelector('.modal-change');
        
        const addSocial = document.getElementById('addSocial');
        addSocial.addEventListener('click', function(){
            let socialsInputWrapper = document.createElement('div');
            const socialsOptions = createSocialsOptions();
            const socialsInput = document.createElement('input');
            const removeSocialButton = document.createElement('button');
            removeSocialButton.type = 'button';
            removeSocialButton.classList.add("remove-social");
            removeSocialButton.addEventListener("click", function(){
                socialsInputWrapper.remove();
                if (socialsInputList.length === 10) {
                    addSocial.style.display = "block"; // Show the "Add Contact" button when removing a contact if the maximum number is reached
                }
            })
            
            socialsInput.placeholder = 'Введите данные контакта';

            socialsInputWrapper.appendChild(socialsOptions);
            customSelect(socialsOptions);
            socialsOptions.classList.add("custom-select")
            socialsInputWrapper.appendChild(socialsInput);
            socialsInputWrapper.appendChild(removeSocialButton);
            socialsInputWrapper.classList.add("socials-wrapper")
            
            
            const modalContent = document.querySelector('.modal-content');
            const addButton = document.getElementById("addSocial");
            modalContent.insertBefore(socialsInputWrapper, addButton);
            let inputObject = {'socialsOptions':socialsOptions, 'socialsInput':socialsInput}
            socialsInputList.push(inputObject);
            socialsInput.id = socialsOptions.value;
            applyMaskToInputs()
            socialsOptions.onchange = () => {
                socialsInput.id = socialsOptions.value;
                applyMaskToInputs()
            }
            if (socialsInputList.length === 10) {
                addSocial.style.display = "none"; // Hide the "Add Contact" button when the maximum number is reached
            }
            document.querySelectorAll('.socials-wrapper input').forEach(function(input) {
                console.log(input);
                validator.addField(input, [
                    {
                        rule: 'required',
                    },
                    {
                        rule: 'minLength',
                        value: 15
                    }
                ]);
            });
        
        
        })

        const sortByNameButton = document.getElementById("sortByName");
        sortByNameButton.addEventListener('click', function(){
            data = sortByName(data);
            sortByNameButton.classList.toggle('sort-button-up');
            if(sortByNameButton.classList.length > 0) data.reverse();
            document.querySelector('.table-body').innerHTML = "";
            console.log(data);
            redrawTable(data);
        });
        const sortByIdButton = document.getElementById("sortById");
        sortByIdButton.addEventListener('click', function(){
            data = sortById(data);
            sortByIdButton.classList.toggle('sort-button-up');
            if(sortByIdButton.classList.length > 0) data.reverse();
            document.querySelector('.table-body').innerHTML = "";
            console.log(data);
            redrawTable(data);
        });
        const sortByCreatedTimeButton = document.getElementById('sortByCreatedTime');
        sortByCreatedTimeButton.addEventListener('click', function(){
            data = sortByCreatedTime(data);
            sortByCreatedTimeButton.classList.toggle('sort-button-up');
            if(sortByCreatedTimeButton.classList.length > 0) data.reverse();
            document.querySelector('.table-body').innerHTML = "";
            console.log(data);
            redrawTable(data);
        });
        const sortByEditedTimeButton = document.getElementById('sortByEditedTime');
        sortByEditedTimeButton.addEventListener('click', function(){
            data = sortByEditedTime(data);
            sortByEditedTimeButton.classList.toggle('sort-button-up');
            if(sortByEditedTimeButton.classList.length > 0) data.reverse();
            document.querySelector('.table-body').innerHTML = "";
            console.log(data);
            redrawTable(data);
        })
        const searchInput = document.getElementById("headerSearch");
        searchInput.value = "";
        let timeOutId;
        searchInput.addEventListener('input', function(){
            window.clearTimeout(timeOutId);
            timeOutId = window.setTimeout(function(){
                filter(searchInput, data);
            }, 300);
            
        })
        const closeButton = document.querySelector('.close');
        closeButton.addEventListener('click', function(){
            form.classList.remove('show-modal-form');
        });
        
        btn.addEventListener('click', function(){
            form.classList.add('show-modal-form');
        });

        

        validator.onSuccess(function(e){
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const surname = document.getElementById('surname').value.trim();
            const lastName = document.getElementById('lastName').value.trim();
            let contacts = [];
            console.log(socialsInputList);
            for(let input of socialsInputList){
                let contact = {'type': input.socialsOptions.value, 'value': input.socialsInput.value};
                contacts.push(contact);
            }
            let student = {'name': name, 'surname': surname, 'lastName':lastName, 'contacts': contacts};
            addStudentToDb(student);
            form.reset();
            
            
        });
        // IMask(
        //     document.getElementById('phone-mask'),
        //     {
        //       mask: '+{7}(000)000-00-00'
        //     }
        //   )
    }
    document.addEventListener("DOMContentLoaded", function(){
        createApp();
    })
})();