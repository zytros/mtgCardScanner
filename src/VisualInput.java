import core.PythonScriptRunner;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class VisualInput{

    public String[] getScan() {
        String[] str = new String[2];
        String[] args = new String[]{"textDetection.py"};
        PythonScriptRunner psr = new PythonScriptRunner(str, args);
        return null;
    }


}
