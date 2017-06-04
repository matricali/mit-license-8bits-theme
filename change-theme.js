/*
MIT License

Copyright (c) 2017 Adrian Haasler García, Jorge Matricali

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

function changeTheme (variant) {
  var css = 'themes/8bits-' + variant + '.css'
  css = css.replace('-default', '')

  var link = document.createElement('link')
  link.setAttribute('rel', 'stylesheet')
  link.setAttribute('type', 'text/css')
  link.setAttribute('href', css)

  document.getElementsByTagName('head').item(0).appendChild(link)
  if (document.getElementsByTagName('link').length > 4) {
    link = document.getElementsByTagName('link').item(0)
    link.parentNode.removeChild(link)
  }
}

function toggleGravatar () {
  var gravatar = document.getElementById('gravatar')
  if (gravatar === null) {
    gravatar = document.createElement('img')
    gravatar.setAttribute('id', 'gravatar')
    gravatar.setAttribute('src', 'http://www.gravatar.com/avatar/749a19dd57249ce61a6e031288193d4e')
    var article = document.getElementsByTagName('article').item(0)
    article.insertBefore(gravatar, article.childNodes[0])
  } else {
    gravatar.parentNode.removeChild(gravatar)
  }
}

window.onload = function () {
  var themeVariants = []

  function addThemeSelector (parent) {
    var select = document.createElement('select')
    select.setAttribute('name', 'color')
    select.setAttribute('onchange', 'changeTheme(this.value);')
    for (var i = 0; i < themeVariants.length; i++) {
      var option = document.createElement('option')
      option.setAttribute('value', themeVariants[i])
      option.appendChild(document.createTextNode(themeVariants[i]))
      if (themeVariants[i] === 'default') {
        option.selected = true
      }
      select.appendChild(option)
    }
    parent.appendChild(select)
  }

  function addGravatarToggle (parent) {
    var button = document.createElement('button')
    button.setAttribute('onclick', 'toggleGravatar();')
    button.appendChild(document.createTextNode('Toggle gravatar'))
    parent.appendChild(button)
  }

  function addCustomizer () {
    var customizer = document.createElement('div')
    customizer.setAttribute('id', 'customizer')
    customizer.setAttribute('style', 'position:absolute;top:0;left:0;')
    addThemeSelector(customizer)
    addGravatarToggle(customizer)
    document.getElementsByTagName('body')[0].appendChild(customizer)
  }

  addCustomizer()
}
