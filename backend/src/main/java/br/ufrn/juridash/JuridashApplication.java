package br.ufrn.juridash;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {
    "br.ufrn.juridash", 
    "br.ufrn.academix.framework.core"
})
@EntityScan(basePackages = {
    "br.ufrn.juridash.domain.model", 
    "br.ufrn.academix.framework.core"
})
@EnableJpaRepositories(basePackages = {
    "br.ufrn.juridash.domain.repository", 
    "br.ufrn.academix.framework.core"
})
public class JuridashApplication {
    public static void main(String[] args) {
        SpringApplication.run(JuridashApplication.class, args);
    }
}