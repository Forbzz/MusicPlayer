let Footer = {
    render: async() => {
        let view = `
        <div class="info-block">
            <p>Contacts:</p>
            <a href="https://vk.com/forbzzz">VK</a>
        </div>
        `
        return view
    },
    after_render: async() => {}
}

export default Footer;