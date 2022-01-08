package core;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class PythonScriptRunner implements Runnable{
    String[] returnVal;
    String[] args;

    public PythonScriptRunner(String[] returnVal, String[] args) {
        this.returnVal = returnVal;
        this.args = args;
    }

    @Override
    public void run() {
        String read = "";
        try{
            ProcessBuilder builder = new ProcessBuilder("python", System.getProperty("user.dir") + "\\pyScript\\" + args[0]);
            Process process = builder.start();

            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));

            String lines = null;
            while((lines = reader.readLine()) != null){
                read += lines + "#";
            }

        } catch (IOException e) {
            e.printStackTrace();
        }

        returnVal = read.split("##");
    }
}
