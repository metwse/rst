var rst = eval('rst')
const d = document

async function setFile(file) {
    select.fileName.parentElement.style.display = ''
    select.fileName.innerText = `${file.name} (${Math.floor(Math.random() * 1000)})`
    const r = new FileReader()
    r.onload = () => {
        _rst = { rst: r.result, name: file.name }
        run.button.removeAttribute('disabled')
    }
    r.readAsText(file)
}

const select = d.querySelector('.section.select-file')
select.fileName = select.querySelector('.file .name')
select.input = select.querySelector('input')
select.upload = select.querySelector('button')
const run = d.querySelector('.section.run')
run.button = run.querySelector('button')
const download = d.querySelector('.section.download')
download.button = download.querySelector('button')
download.p = download.querySelector('p')
download.a = download.querySelector('a')
var _rst, _mlt

select.upload.ondrop = e => (e.preventDefault(), setFile(e.dataTransfer.files[0]))
select.upload.ondragover = e => e.preventDefault()
select.upload.onclick = () => select.input.click()
select.input.oninput = () => { setFile(select.input.files[0]) }

run.button.onclick = () => {
    _mlt = rst.parse(_rst.rst)
    _mlt.name = _rst.name.match(/^([\s\S]*)\.[\s\S]*$/)[1] + '.mlt'
    download.p.innerText = `Converted: ${_rst.name} > ${_mlt.name} ${_mlt.length} (${Math.floor(Math.random() * 1000)})`
    download.button.removeAttribute('disabled')
    download.a.href = URL.createObjectURL(new Blob([_mlt.mlt], { type: 'application/octet-stream' }))
    download.a.download = _mlt.name
    download.button.onclick = () => download.a.click()
}
