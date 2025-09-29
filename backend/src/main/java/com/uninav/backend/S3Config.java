package com.uninav.backend;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class S3Config {

    @Bean
    public S3Client s3Client() {

        Dotenv dotenv = Dotenv.configure()
                .filename(".env").directory("backend/.env") // Specify the filename if different
                .load();

        // Server Configuration
//        String accessKeyId = System.getenv("AWS_ACCESS_KEY_ID");
//        String secretAccessKey = System.getenv("AWS_SECRET_ACCESS_KEY");
//        String region = System.getenv("AWS_REGION");

        // Local Configuration
        String accessKeyId = dotenv.get("AWS_ACCESS_KEY_ID");
        String secretAccessKey = dotenv.get("AWS_SECRET_ACCESS_KEY");
        String region = dotenv.get("AWS_REGION");

        AwsBasicCredentials awsCreds = AwsBasicCredentials.create(accessKeyId, secretAccessKey);

        assert region != null;
        return S3Client.builder()
                .region(Region.of(region))
                .credentialsProvider(StaticCredentialsProvider.create(awsCreds))
                .build();
    }
}
