
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Bootstrap 4, from LayoutIt!</title>

    <meta name="description" content="Source code generated using layoutit.com">
    <meta name="author" content="LayoutIt!">

    <link href="layoutit/src/css/bootstrap.min.css" rel="stylesheet">
    <link href="layoutit/src/css/style.css" rel="stylesheet">

  </head>
  
    <style>
 	 	span {color:skyblue;}
  
 	</style>
 	
  <body>

 <div class="container-fluid">
	<div class="row">
		<div class="col-md-4">
		</div>
		<div class="col-md-4">
			<div class="page-header">
				
				<br>
					<h1><a class="nav-link active" href="home.do"> <span>시설</span> 대관 관리 시스템</a></h1> 
				<br>
				<br>
				
			</div>
		</div>
	<div class="col-md-4">
			<ul class="nav">
				<li class="nav-item">
					<a class="nav-link active" href="#">INTRODUCTION</a>
				</li>
				<li class="nav-item">
					<a class="nav-link" href="#">LOGIN</a>
				</li>
				<li class="nav-item">
					<a class="nav-link" href="#">SIGN IN</a>
				</li>
			</ul>
		</div>
	</div>
	<div class="row">
		<div class="col-md-6">
			<nav class="navbar navbar-toggleable-md">
				 
				<button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
					<span class="navbar-toggler-icon"></span>
				</button> <a class="navbar-brand" href="#">소개</a>
				<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
					<ul class="navbar-nav">
						<li class="nav-item active">
							 <a class="nav-link" href="ResCheck.do">시설 예약조회</a>
						</li>
						<li class="nav-item active">
							 <a class="nav-link" href="#">시설 예약등록</a>
						</li>
						<li class="nav-item active">
							 <a class="nav-link" href="#">시설 예약수정</a>
						</li>
					</ul>
	
				</div>
			</nav>
		</div>
		<div class="col-md-6">
			<nav class="navbar navbar-toggleable-md navbar-light bg-faded">
				<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
					<form class="form-inline">
						<input class="form-control mr-sm-2" type="text"> 
						<button class="btn btn-primary my-2 my-sm-0" type="submit">
							Search
						</button>
					</form>
				</div>
			</nav>
		</div>
	</div>
	
	<!-- 기본프레임 --> 
	
	<div class="row">
		<div class="col-md-12">
			<hr>
		<br>
		<br>
		<br>
			<h3 class="text-center">
				공공시설 예약 현황 
			</h3>
			<br>
			<table class="table table-bordered">
				<thead>
					<tr>
						<th>
							예약번호
						</th>
						<th>
							시설이름
						</th>
						<th>
							예약접수날짜
						</th>
						<th>
							시설사용기간 
						</th>
						<th>
							대관료
						</th>
					</tr>
				</thead>
				<tbody>
					<tr class="table-active">
						<td>
							0000-0001
						</td>
						<td>
							청주 예술의 전당
						</td>
						<td>
							2018.3.16
						</td>
						<td>
							2018.3.24 ~ 2018.3.28
						</td>
						<td>
							30000
						</td>
					</tr>
					<tr class="table-active">
						<td>
							1
						</td>
						<td>
							TB - Monthly
						</td>
						<td>
							01/04/2012
						</td>
						<td>
							Approved
						</td>
						<td>
							Approved
						</td>
					</tr>
					<tr class="table-active">
						<td>
							2
						</td>
						<td>
							TB - Monthly
						</td>
						<td>
							02/04/2012
						</td>
						<td>
							Declined
						</td>
						<td>
							Declined
						</td>
					</tr>
					<tr class="table-active">
						<td>
							3
						</td>
						<td>
							TB - Monthly
						</td>
						<td>
							03/04/2012
						</td>
						<td>
							Pending
						</td>
						<td>
							Pending
						</td>
					</tr>
					<tr class="table-active">
						<td>
							4
						</td>
						<td>
							TB - Monthly
						</td>
						<td>
							04/04/2012
						</td>
						<td>
							Call in to confirm
						</td>
						<td>
							Call in to confirm
						</td>
					</tr>
				</tbody>
			</table>
			<div class="row">
				<div class="col-md-4">
				</div>
				<div class="col-md-4">
					<nav>
						<ul class="pagination">
							<li class="page-item">
								<a class="page-link" href="#">Previous</a>
							</li>
							<li class="page-item">
								<a class="page-link" href="#">1</a>
							</li>
							<li class="page-item">
								<a class="page-link" href="#">2</a>
							</li>
							<li class="page-item">
								<a class="page-link" href="#">3</a>
							</li>
							<li class="page-item">
								<a class="page-link" href="#">4</a>
							</li>
							<li class="page-item">
								<a class="page-link" href="#">5</a>
							</li>
							<li class="page-item">
								<a class="page-link" href="#">Next</a>
							</li>
						</ul>
					</nav>
				</div>
				<div class="col-md-4">
				</div>
			</div>
		</div>
	</div>
</div>

    <script src="layoutit/srcsrc/js/jquery.min.js"></script>
    <script src="layoutit/srcsrc/js/bootstrap.min.js"></script>
    <script src="layoutit/src/js/scripts.js"></script>
  </body>
</html>