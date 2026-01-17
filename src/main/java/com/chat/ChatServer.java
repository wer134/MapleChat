package main.java.com.chat;

import org.glassfish.tyrus.server.Server;
import org.glassfish.grizzly.http.server.HttpServer;
import org.glassfish.grizzly.http.server.StaticHttpHandler;
import org.glassfish.grizzly.http.server.NetworkListener;

import java.io.File;
import java.util.Scanner;

public class ChatServer {
    private static final String HOST = "localhost";
    private static final int PORT = 8080;
    private static final String CONTEXT_PATH = "/";

    public static void main(String[] args) {
        Server server = new Server(HOST, PORT, CONTEXT_PATH, null, ChatEndpoint.class);
        HttpServer httpServer = null;

        try {
            // 정적 파일 서빙을 위한 HTTP 서버 먼저 시작
            httpServer = new HttpServer();
            NetworkListener networkListener = new NetworkListener("grizzly", HOST, PORT);
            httpServer.addListener(networkListener);
            
            String webappPath = new File("src/main/webapp").getAbsolutePath();
            StaticHttpHandler staticHandler = new StaticHttpHandler(webappPath);
            httpServer.getServerConfiguration().addHttpHandler(staticHandler, "/");
            httpServer.start();
            
            // WebSocket 서버 시작
            server.start();
            
            System.out.println("==========================================");
            System.out.println("WebSocket 채팅 서버가 시작되었습니다!");
            System.out.println("==========================================");
            System.out.println("서버 주소: ws://" + HOST + ":" + PORT + "/chat");
            System.out.println("웹 클라이언트: http://" + HOST + ":" + PORT + "/index.html");
            System.out.println("==========================================");
            System.out.println("서버를 종료하려면 'quit' 또는 'exit'를 입력하세요.");
            System.out.println("==========================================");

            // 서버 종료 대기
            Scanner scanner = new Scanner(System.in);
            while (true) {
                String input = scanner.nextLine();
                if ("quit".equalsIgnoreCase(input) || "exit".equalsIgnoreCase(input)) {
                    break;
                }
            }

        } catch (Exception e) {
            System.err.println("서버 시작 오류: " + e.getMessage());
            e.printStackTrace();
        } finally {
            try {
                server.stop();
                if (httpServer != null) {
                    httpServer.shutdown();
                }
                System.out.println("서버가 종료되었습니다.");
            } catch (Exception e) {
                System.err.println("서버 종료 오류: " + e.getMessage());
            }
        }
    }
}