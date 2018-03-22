package Rental.mvc.web;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

//scan 할때 Controller를 보고 인식
@Controller // anotation helloController 클래스 Controller를 클래스로 정
public class HelloController {
	private String viewHello = "Rental/hello";
	private String viewResCheck = "/Rental/ResCheck";
	private String viewHome = "/Rental/Home";
	private String viewResRegister = "/Rental/ResRegister" ;
	
	public String getViewResCheck(){
		return this.viewResCheck;
	}
	
	public String getViewHello() {
		return this.viewHello;
	}
	
	public String getViewHome() {
		return this.viewHome;
	}
	
	public String getViewResRegister(){
		return this.viewResRegister;
	}
	
	@RequestMapping(value="/ResCheck.do") // 시설예약조회 이동  
	public String ResCheck(){
		return getViewResCheck();
	}
	
	@RequestMapping(value="/ResRegister.do") // 시설예약등록 이동  
	public String ResRegister(){
		return getViewResRegister();
	}
	
	@RequestMapping(value="/home.do") //홈페이지로 돌아가기 
	public String Home(){
		return getViewHome();
	}
	
}
