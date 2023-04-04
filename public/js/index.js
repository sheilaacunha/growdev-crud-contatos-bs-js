
let idAtualizar = -1
let listaContatos = JSON.parse(localStorage.getItem('contacts')) ?? [];



const formCadastro = document.getElementById('form-cadastro')
const formAtualizar = document.getElementById('form-atualizar')

const nameUpdate = document.getElementById('name-update')
const phoneUpdate = document.getElementById('phone-update')
const emailUpdate = document.getElementById('email-update')
const linkedinUpdate = document.getElementById('linkedin-update')


const row = document.getElementById('list-contacts')
const containerNotificacao = document.getElementById('container-notificacao')

// 1 - Como manipular um Modal do Bootstrap utilizando JS
const modalCadastro = new bootstrap.Modal('#modal-cadastro')
const modalApagar = new bootstrap.Modal('#modal-apagar')
const modalAtualizar = new bootstrap.Modal('#modal-atualizar')

document.addEventListener('DOMContentLoaded', () => {
    listaContatos.forEach((contact) => addContact(contact))
    contatosTamanho()
})

formCadastro.addEventListener('submit', (ev) => {
    ev.preventDefault()

    // chamar a validação deste formulário
    if (!formCadastro.checkValidity()) {
        formCadastro.classList.add('was-validated')
        return
    }

    const name = document.getElementById('name').value
    const phone = document.getElementById('phone').value
    const email = document.getElementById('email').value
    const linkedin = document.getElementById('linkedin').value



    const exist = listaContatos.some((valor) => valor.phone === phone)

    if (exist) {
        //alert("Você já cadastrou esse contato anteriormente!")
        modalCadastro.hide()
        showAlert('danger', '👎 Você já cadastrou esse contato anteriormente!')
        return
    }

    const newContact = {
        id: new Date().getTime(),
        name,
        phone,
        email,
        linkedin
    }

    // 1 - O dado alterou? Atualizou? Chama o setItem
    listaContatos.push(newContact)
    localStorage.setItem('contacts', JSON.stringify(listaContatos))
    formCadastro.reset()
    addContact(newContact)
    modalCadastro.hide()
    formCadastro.classList.remove('was-validated')
    showAlert('success', '🚀 Contato cadastrado com sucesso! ')
    contatosTamanho()
})

formAtualizar.addEventListener('submit', (ev) => {
    ev.preventDefault();

    // chamar a validação deste formulário
    if (!formAtualizar.checkValidity()) {
        formAtualizar.classList.add('was-validated')
        return
    }


    // some => desconsiderar o id que esta sendo atualizado
    const exist = listaContatos.some((contato) => {
        if (contato.id === idAtualizar) {
            return false
        }

        return contato.phone === phoneUpdate.value
    })

    if (exist) {
        modalAtualizar.hide()
        showAlert('danger', 'Esse número já esta salvo como outro contato!')
        return
    }

    // ATUALIZAR A LISTA LOCAL
    const indiceUpdate = listaContatos.findIndex((contato) => contato.id === idAtualizar);
    listaContatos[indiceUpdate].name = nameUpdate.value
    listaContatos[indiceUpdate].phone = phoneUpdate.value
    listaContatos[indiceUpdate].email = emailUpdate.value
    listaContatos[indiceUpdate].linkedin = linkedinUpdate.value

    // ATUALIZAR O LOCASTORAGE
    localStorage.setItem('contacts', JSON.stringify(listaContatos))

    // ATUALIZAR O ELEMENTO NA DOM
    const cardTitle = document.querySelector(`#contato-${idAtualizar} .card-title`);
    cardTitle.innerHTML = nameUpdate.value

    const cardText = document.querySelector(`#contato-${idAtualizar} .phone`);
    cardText.innerHTML = phoneUpdate.value

    const cardTextEmail = document.querySelector(`#contato-${idAtualizar} .email`);
    cardTextEmail.innerHTML = emailUpdate.value

    const cardTextLinkedin = document.querySelector(`#contato-${idAtualizar} .linkedin`);
    cardTextLinkedin.innerHTML = linkedinUpdate.value


    modalAtualizar.hide()
    showAlert('success', 'Contato atualizado com sucesso! 👌')
    idAtualizar = -1
    formAtualizar.classList.remove('was-validated')
})
function dataAtual() {
    let data = new Date().toLocaleDateString('pt-BR', { dateStyle: 'short' });
    return data
}
function contatosTamanho() {
    const contatosN = document.getElementById('contatosN')
    contatosN.innerHTML = listaContatos.length

}

function addContact(contact) {
    const { id, name, phone, email, linkedin } = contact;

    const col = document.createElement('div')

    col.setAttribute('class', 'col-12 col-sm-6 col-lg-4 col-xl-3')
    col.setAttribute('id', `contato-${id}`)

    const card = document.createElement('div')
    card.classList.add('card', 'text-light')

    const cardData = document.createElement('small')

    cardData.classList.add('class', 'text-secondary')
    cardData.innerHTML = `  Criado: ${dataAtual()} `

    const cardBody = document.createElement('div')
    cardBody.setAttribute('class', 'card-body')


    const cardTitle = document.createElement('h5')
    cardTitle.setAttribute('class', 'card-title')
    cardTitle.innerHTML = name

    const cardTextPhone = document.createElement('p')
    cardTextPhone.setAttribute('class', 'card-text phone')
    cardTextPhone.innerHTML = phone

    const cardTextEmail = document.createElement('p')
    cardTextEmail.setAttribute('class', 'card-text email')
    cardTextEmail.innerHTML = email

    const cardTextLinkedin = document.createElement('p')
    cardTextLinkedin.setAttribute('class', 'card-text linkedin')
    cardTextLinkedin.innerHTML = linkedin

    const buttonEdit = document.createElement('button')
    buttonEdit.setAttribute('class', 'btn btn-success m-1')
    buttonEdit.addEventListener('click', () => {
        modalAtualizar.show()
        phoneUpdate.value = phone
        emailUpdate.value = email
        nameUpdate.value = name
        linkedinUpdate.value = linkedin
        idAtualizar = id
    })
    buttonEdit.innerHTML = `<i class="bi bi-pencil-square"></i>`


    const buttonDelete = document.createElement('button')
    buttonDelete.setAttribute('class', 'btn btn-danger m-1')
    buttonDelete.innerHTML = `<i class="bi bi-trash3"></i>`
    buttonDelete.addEventListener('click', () => {
        modalApagar.show()
        const confirmar = document.getElementById('confirmar-exclusao')
        confirmar.setAttribute('onclick', `apagar(${id})`)
    })


    cardBody.appendChild(cardTitle)
    cardBody.appendChild(cardTextPhone)
    cardBody.appendChild(cardTextEmail)
    cardBody.appendChild(cardTextLinkedin)

    cardBody.appendChild(buttonEdit)
    cardBody.appendChild(buttonDelete)
    cardBody.appendChild(cardData)


    card.appendChild(cardBody)
    col.appendChild(card)

    row.appendChild(col)



}

function apagar(idContato) {
    // EXCLUIR DA LISTA DE CONTATOS LOCAL
    const indice = listaContatos.findIndex((contato) => contato.id === idContato)
    listaContatos.splice(indice, 1)


    // ATUALIZAR O LOCALSTORAGE
    localStorage.setItem('contacts', JSON.stringify(listaContatos))

    // EXCLUIR O COL DA DOM
    const col = document.getElementById(`contato-${idContato}`)
    col.remove()


    modalApagar.hide()
    showAlert('success', '👍 Contato deletado com sucesso!')
    contatosTamanho()
}

function showAlert(modo, mensagem) {
    const toast = document.createElement('div');
    toast.setAttribute('role', 'alert')
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    toast.setAttribute('class', 'bounce-top toast  show');
    toast.classList.add(`text-bg-${modo}`);

    const content = document.createElement('div');
    content.setAttribute('class', 'd-flex');

    const toastBody = document.createElement('div')
    toastBody.setAttribute('class', 'toast-body')
    toastBody.innerHTML = `${mensagem}`

    const butttonDismiss = document.createElement('button')
    butttonDismiss.setAttribute('type', 'button')
    butttonDismiss.setAttribute('class', 'btn-close btn-close-white me-2 m-auto')
    butttonDismiss.setAttribute('data-bs-dismiss', 'toast')
    butttonDismiss.setAttribute('aria-label', 'Fechar notificação')

    content.appendChild(toastBody)
    content.appendChild(butttonDismiss)
    toast.appendChild(content);

    containerNotificacao.appendChild(toast)


    setTimeout(() => {
        containerNotificacao.children[0].remove()
    }, 3000)

}