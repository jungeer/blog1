$(function() {

  // 登录注册面板的切换
  let $signUp = $('.sign-up')
  let $signIn = $('.sign-in')
  let $userinfo = $('.userinfo')
  $('.sign-up .login-in').click(function() {
    $signUp.hide()
    $signIn.show()
  })
  $('.sign-in .register').click(function() {
    $signIn.hide()
    $signUp.show()
  })

  // 注册
  $('.register-btn').click(function() {
    // 通过 ajax 提交请求
    $.ajax({
      type: 'post',
      url: '/api/user/register',
      data: {
        username: $signUp.find('[name="username"]').val(),
        password: $signUp.find('[name="password"]').val(),
        repassword: $signUp.find('[name="repassword"]').val()
      },
      dataType: 'json',
      success (result) {
        $signUp.find('.tip').html(result.message)
        if (!result.code) {
          // 注册成功
          setTimeout(function() {
            $signUp.hide()
            $signIn.show()
          }, 1000)
        }
      }
    })
  })

  // 登录
  $('.login-btn').click(function() {
    $.ajax({
      type: 'post',
      url: '/api/user/login',
      data: {
        username: $signIn.find('[name="username"]').val(),
        password: $signIn.find('[name="password"]').val()
      },
      dataType: 'json',
      success (result) {
        $signIn.find('.tip').html(result.message)
        if (!result.code) {
          // 登录成功
          window.location.reload()
        }
      }
    })
  })

  // 退出
  $('.logout').click(function() {
    $.ajax({
      url: '/api/user/logout',
      success (result) {
        if (!result.code) {
          window.location.reload()
        }
      }
    })
  })
})
