const defaultStyle = {
    color: '#FFFFFFFF', background: '#77000000',
    padding: 10, lineGap: 15,
    left: 0, top: 0, width: 1920, height: 1080,
    font: { style: 'normal', size: 40, family: 'Arial', weight: 400 },
    outline: { width: 1, color: '#FF000000' },
    align: { horizontal: 'center', vertical: 'bottom' },
}



//{{{ xml
const toTrack = (out, subtitles) => `
<?xml version="1.0" encoding="utf-8"?>
<mlt LC_NUMERIC="C" version="7.13.0" root="" parent="producer0" in="00:00:00.000" out="${out}">
	<producer id="producer0" in="00:00:00.000" out="${out}">
		<property name="length">04:00:00.000</property>
		<property name="eof">pause</property>
		<property name="resource">#00000000</property>
		<property name="aspect_ratio">1</property>
		<property name="mlt_service">color</property>
		<property name="mlt_image_format">rgb24a</property>
		<property name="shotcut:caption">transparent</property>
		<property name="shotcut:detail">transparent</property>
		<property name="ignore_points">0</property>
		<property name="global_feed">1</property>
		<property name="xml">was here</property>
		<property name="seekable">1</property>
		${subtitles}
	</producer>
</mlt>`

const toMLT = (out, subtitles) => `
<?xml version="1.0" standalone="no"?>
<mlt LC_NUMERIC="C" version="6.25.0" title="Shotcut version 21.03.21" producer="main_bin">
  <profile description="HD 1080p 25 fps" width="1920" height="1080" progressive="1" sample_aspect_num="1" sample_aspect_den="1" display_aspect_num="16" display_aspect_den="9" frame_rate_num="25" frame_rate_den="1" colorspace="709"/>
  <playlist id="main_bin">
    <property name="xml_retain">1</property>
  </playlist>
  <producer id="black" in="00:00:00.000" out="${out}">
    <property name="length">${out}</property>
    <property name="eof">pause</property>
    <property name="resource">0</property>
    <property name="aspect_ratio">1</property>
    <property name="mlt_service">color</property>
    <property name="mlt_image_format">rgb24a</property>
    <property name="set.test_audio">0</property>
  </producer>
  <playlist id="background">
    <entry producer="black" in="00:00:00.000" out="${out}"/>
  </playlist>
  <producer id="producer0" in="00:00:00.000" out="03:59:59.960">
    <property name="length">04:00:00.000</property>
    <property name="eof">pause</property>
    <property name="resource">#00000000</property>
    <property name="aspect_ratio">1</property>
    <property name="mlt_service">color</property>
    <property name="mlt_image_format">rgb24a</property>
    <property name="shotcut:caption">transparent</property>
    <property name="shotcut:detail">transparent</property>
    <property name="ignore_points">0</property>
    <property name="global_feed">1</property>
    <property name="xml">was here</property>
    <property name="seekable">1</property>
    ${subtitles}
  </producer>
  <playlist id="playlist0">
    <property name="shotcut:video">1</property>
    <property name="shotcut:name">V1</property>
    <property name="shotcut:lock">0</property>
    <entry producer="producer0" in="00:00:00.000" out="${out}"/>
  </playlist>
  <tractor id="tractor0" title="Shotcut version 21.03.21" global_feed="1" in="00:00:00.000" out="${out}">
    <property name="shotcut">1</property>
    <property name="shotcut:projectAudioChannels">2</property>
    <property name="shotcut:projectFolder">0</property>
    <property name="shotcut:scaleFactor">4</property>
    <track producer="background"/>
    <track producer="playlist0" hide="audio"/>
    <transition id="transition0">
      <property name="a_track">0</property>
      <property name="b_track">1</property>
      <property name="mlt_service">mix</property>
      <property name="always_active">1</property>
      <property name="sum">1</property>
    </transition>
    <transition id="transition1">
      <property name="a_track">0</property>
      <property name="b_track">1</property>
      <property name="version">0.9</property>
      <property name="mlt_service">frei0r.cairoblend</property>
      <property name="threads">0</property>
      <property name="disable">1</property>
    </transition>
  </tractor>
</mlt>
`

const toSubtitle = (id, text, interval, style) => `
    <filter id="filter${id}" in="${interval.in}" out="${interval.out}">
      <property name="argument">${text}</property>
      <property name="geometry">${style.left} ${style.top} ${style.width} ${style.height} 1</property>
      <property name="family">${style.font.family}</property>
      <property name="size">${style.font.size}</property>
      <property name="weight">${style.font.weight}</property>
      <property name="style">${style.font.style}</property>
      <property name="fgcolour">${style.color}</property>
      <property name="bgcolour">${style.background}</property>
      <property name="olcolour">${style.outline.color}</property>
      <property name="pad">${style.padding}</property>
      <property name="halign">${style.align.horizontal}</property>
      <property name="valign">${style.align.vertical}</property>
      <property name="outline">${style.outline.width}</property>
      <property name="mlt_service">dynamictext</property>
      <property name="shotcut:filter">dynamicText</property>
      <property name="shotcut:usePointSize">1</property>
      <property name="shotcut:animIn">00:00:00.000</property>
      <property name="shotcut:animOut">00:00:00.000</property>
      <property name="shotcut:pointSize">${style.font.size}</property>
    </filter>
`
//}}}



//{{{ misc 
function parseStyle(text) {
    var cs = { '*': { ...defaultStyle } }
    const applyRules = (selector, rules) => {
        if (!cs[selector]) cs[selector] = {}
        rules.split(';').forEach(rule => {
            var [name, value] = rule.split(':').map(v => v.trim())
            if (['color', 'background', 'top', 'left', 'width', 'height', 'padding'].includes(name)) return cs[selector][name] = value
            if (name == 'line-gap') return cs[selector].lineGap = value
            switch (name) {
                case 'geometry':
                    var [left, top, width, height] = value.split(' ')
                    Object.assign(cs[selector], { left, top, width, height })
                    return
                case 'font':
                    var [style, size, family, weight] = value.split(' ')
                    Object.assign(cs[selector], { font: { style, size, family, weight } })
                    return
                case 'outline':
                    var [width, color] = value.split(' ')
                    Object.assign(cs[selector], { outline: { width, color } })
                    return
                case 'align':
                    var [horizontal, vertical] = value.split(' ')
                    Object.assign(cs[selector], { align: { horizontal, vertical } })
                    return
            }
            var parts = name.match(/^([\w]*)-([\w]*)/), key
            if (parts && parts.length == 3) {
                key = parts[2] == 'align' ? 2 : 1
                if (!cs[selector][parts[key]]) cs[selector][parts[key]] = {}
                Object.assign(cs[selector][parts[key]], { [parts[3 - key]]: value })
            }
        })
        return ''
    }
    text.replace(/([\s\S]*?)\ \{([\s\S]*?)\}/g, (_, selector, rules) => selector.split(',').forEach(selector => applyRules(selector.trim(), rules)))
    return cs
}

function parseTime(time) {
    var result = 0
    for (let i of time.replace(/([\d]*):(\d\d):(\d\d)(?:(?:\.|\,)([\d]*))?/g, (_, h, m, s, ms) => result += h * 3600 + m * 60 + +s + (ms ? ms / (10 ** ms.length) : 0)).split(' ')) {
        var a = Number.parseFloat(i) * (i.endsWith('ms') ? 0.001 : { s: 1, m: 60, h: 3600 }[i.at(-1)])
        if (!isNaN(a)) result += a
    }
    return result
}
function toTimeString(time) {
    return `00${Math.floor(time / 3600) || ''}:${(Math.floor((time % 3600) / 60) / 100 + '0').substring(2, 4) || '00'}:${(Math.floor(time % 60) / 100 + '0').substring(2, 4) || '00'}.${((time % 1) + '').substring(2)}00`
}

function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item))
}

function mergeDeep(target, ...sources) {
    if (!sources.length) return target
    const source = sources.shift()
    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) target[key] = {}
                mergeDeep(target[key], source[key])
            } 
            else Object.assign(target, { [key]: source[key] })
        }
    }
    return mergeDeep(target, ...sources)
}
//}}}



function parse(text) {
    var style = '', subtitles = [['', []]], out = 0

    let styleLines = true, subtitleId = false

    text.split('\n').forEach(line => {
        if (styleLines) { 
            if (line.startsWith('---')) return styleLines = false
            style += line + '\n'
        }
        else { 
            if (subtitleId === false) {
                if (line[0] == '#') subtitleId = 0
                else return 
            }
            if (line == '' && subtitles[subtitleId][0]) { subtitles.push([false, []]); subtitleId++ }
            else {
                if (line[0] == '#') { 
                    subtitles[subtitleId][0] = line.substring(1).split('-').map(v => parseTime(v))
                    if (subtitles[subtitleId][0][1] > out) out = subtitles[subtitleId][0][1]
                }
                else subtitles[subtitleId][1].push(line)
            }
        }
    })
    if (!subtitles.at(-1)[0]) subtitles.pop()

    style = parseStyle(style)
    var all = JSON.stringify(style['*'])
    for (let key of Object.keys(style)) {
        if (key == '*') continue
        style[key] = mergeDeep(JSON.parse(all), style[key])
    }

    var id = 0, parased = ''
    for (let [time, _subtitles] of subtitles) {
        let pad  = { top: 0, bottom: 0 }, a
        _subtitles.forEach(subtitle => {
            const currentStyle = style[subtitle.match(/\@[\S]*/g)?.[0]?.substring(1)] ?? style['*']
            if (currentStyle.align.vertical != 'top') return
            if (a) pad.top += currentStyle.font.size + currentStyle.lineGap
            else a = true
        })
        for (let subtitle of _subtitles.reverse()) {
            var name, text = subtitle.replace(/^\@[\S]*\ /, _name => { name = _name.substring(1).trim(); return '' })
            const currentStyle = style[name] ?? style['*'], oldTop = currentStyle.top
            
            if (currentStyle.align.vertical == 'bottom') currentStyle.top -= pad.bottom, pad.bottom += currentStyle.font.size + currentStyle.lineGap
            else currentStyle.top += pad.top, pad.top -= currentStyle.font.size + currentStyle.lineGap
            
            parased += toSubtitle(id, text, { in: toTimeString(time[0]), out: toTimeString(time[1] - 0.04) }, currentStyle)
            currentStyle.top = oldTop; id++
        }
    }

    return { mlt: toMLT(toTimeString(out), parased).trim(), track: toTrack(toTimeString(out), parased).trim(), length: subtitles.at(-1)[0][1] }
}



window.rst = { parse, parseStyle }
