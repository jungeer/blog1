let perpage = 2
let page = 1
let pages = 0
let comments = []

// 提交评论
$('.review-submit').click(() => {
  if ($('.review').val() === '') {
    alert('留言不能为空')
    return
  }
  $.ajax({
    type: 'POST',
    url: '/api/comment/post',
    data: {
      contentid: $('#contentId').val(),
      content: $('.review').val()
    },
    success (responseData) {
      $('.review').val('')
      comments = responseData.data.comments.reverse()
      renderComment()
    }
  })
})

// 每次页面重载的时候获取文章所有评论
$.ajax({
  url: '/api/comment',
  data: {
    contentid: $('#contentId').val()
  },
  success (responseData) {
    comments = responseData.data.reverse()
    renderComment()
  }
})

// 事件委托
$('.reviews-pages').delegate('a', 'click', function () {
  if ($(this).parent().hasClass('previous')) {
    page--
  } else {
    page++
  }
  renderComment()
})

function renderComment() {

  let html =''
  $('.reviews-count').html(comments.length)

  pages = Math.max(Math.ceil(comments.length / perpage), 1)
  let start = Math.max(0, (page - 1) * perpage)
  let end = Math.min(start + perpage, comments.length)
  let $divs = $('.reviews-pages div')

  $divs.eq(1).html(page + ' / ' + pages )

  if (page <= 1) {
    page = 1
    $divs.eq(0).html('<span>没有上一页了</span>')
  } else {
    $divs.eq(0).html('<a>上一页</a>')
  }
  if (page >= pages) {
    page = pages
    $divs.eq(2).html('<span>没有下一页了</span>')
  } else {
    $divs.eq(2).html('<a>下一页</a>')
  }

  if (comments.length === 0) {
    $('.reviews-box').html('<div class="reviews-four">还没有留言</div>')
    $('.reviews-pages').hide()
  } else {
    for ( let i = start; i < end; i++) {
      html += `
      <div class="reviews-five">
        <div class="reviews-five-head">
          <span>${comments[i].username}</span>
          <span>${formatDate(comments[i].postTime)}</span>
        </div>
        <div class="reviews-five-content">
          ${comments[i].content}
        </div>
      </div>
      `
    }
    $('.reviews-pages').show()
    $('.reviews-box').html(html)
  }

}

function formatDate(d) {
  let date1 = new Date(d)
  return date1.toLocaleString()
}

/*
`
  ${ date1.getFullYear() }年${ date1.getMonth()+1 }月${ date1.getDate() }日
  ${ date1.getHours() }:${ date1.getMinutes() }:${ date1.getSeconds() }
`
*/
