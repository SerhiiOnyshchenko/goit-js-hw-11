export default class LoadeMoreBtn{
	constructor({ selector, hidden = false }) {
		this.refs = this.getRefs(selector)
		hidden&&this.hide()
	}

	getRefs(selector) {
		const refs = {}
		refs.button = document.querySelector(selector)
		refs.label = refs.button.querySelector('.lable')

		return refs
	}

enable(){
	this.refs.button.disabled = false
	this.refs.label.textContent = "Show more"
	this.refs.label.classList.remove('spinner');
}
disable(){
	this.refs.button.disabled = true
	this.refs.label.textContent = "Loading..."
	this.refs.label.classList.add('spinner');
}

show(){
	this.refs.button.classList.remove('is-hidden')
}
hide(){
	this.refs.button.classList.add('is-hidden')
	}
}