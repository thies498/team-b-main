package tuc.isse;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main application class for the Player module.
 */

@SpringBootApplication // without implements CommandLineRunner
public class PlayerApplication{

    public static void main(String[] args) {
        SpringApplication.run(PlayerApplication.class, args);
    }

    //@Override
    //public void run(String... args) throws Exception {

    //}
}
