---
layout: doc
title: 第 7 讲 课堂实操任务
breadcrumb: 课堂实操 (第 7 讲)
---

# 随堂实操任务清单 <span class="subtitle">第 7 讲</span>

> 💡 **操作指南**：点击每个任务右上角的 **“复制模板代码 📋”**，在您的 IDE（IntelliJ IDEA / VS Code）中打开对应类文件并补全核心代码。运行结果请参考下方的 **“预期控制台输出”** 进行自测比对。

[← 返回《Java程序设计》大纲](/courses/java-programming-2026-fall)

---

<PracticeCard
  :task-no="1"
  title="数组堆内存连续模型与常用 Arrays 工具类演示"
  class-name="ArrayMemoryDemo.java"
  template-code="import java.util.Arrays;&#10;&#10;/**&#10; * 数组堆内存连续模型与常用 Arrays 工具类演示&#10; * @author MatNoble&#10; */&#10;public class ArrayMemoryDemo {&#10;    public static void main(String[] args) {&#10;        int[] scores = { 85, 92, 78, 96, 64 };&#10;&#10;        // 1. 数组长度与快速格式化打印&#10;        System.out.println(&quot;数组元素: &quot; + Arrays.toString(scores));&#10;        System.out.println(&quot;数组长度: &quot; + scores.length);&#10;&#10;        // 2. 数组拷贝&#10;        int[] copy = Arrays.copyOf(scores, scores.length);&#10;        Arrays.sort(copy);&#10;        System.out.println(&quot;排序后拷贝副本: &quot; + Arrays.toString(copy));&#10;&#10;        // 3. 二分查找 (必须先排序)&#10;        int idx = Arrays.binarySearch(copy, 85);&#10;        System.out.println(&quot;元素 85 在排序数组中的位置: &quot; + idx);&#10;    }&#10;}"
  output-text=""
>

```java
import java.util.Arrays;

/**
 * 数组堆内存连续模型与常用 Arrays 工具类演示
 * @author MatNoble
 */
public class ArrayMemoryDemo {
    public static void main(String[] args) {
        int[] scores = { 85, 92, 78, 96, 64 };

        // 1. 数组长度与快速格式化打印
        System.out.println("数组元素: " + Arrays.toString(scores));
        System.out.println("数组长度: " + scores.length);

        // 2. 数组拷贝
        int[] copy = Arrays.copyOf(scores, scores.length);
        Arrays.sort(copy);
        System.out.println("排序后拷贝副本: " + Arrays.toString(copy));

        // 3. 二分查找 (必须先排序)
        int idx = Arrays.binarySearch(copy, 85);
        System.out.println("元素 85 在排序数组中的位置: " + idx);
    }
}
```

</PracticeCard>

<PracticeCard
  :task-no="2"
  title="二维数组本质与矩阵转置操作"
  class-name="MatrixTransposeDemo.java"
  template-code="/**&#10; * 二维数组本质与矩阵转置操作&#10; * @author MatNoble&#10; */&#10;public class MatrixTransposeDemo {&#10;    public static void main(String[] args) {&#10;        // 2 行 3 列矩阵&#10;        int[][] matrix = {&#10;            { 1, 2, 3 },&#10;            { 4, 5, 6 }&#10;        };&#10;&#10;        int rows = matrix.length;&#10;        int cols = matrix[0].length;&#10;        int[][] transpose = new int[cols][rows]; // 3 行 2 列&#10;&#10;        for (int i = 0; i &lt; rows; i++) {&#10;            for (int j = 0; j &lt; cols; j++) {&#10;                transpose[j][i] = matrix[i][j];&#10;            }&#10;        }&#10;&#10;        System.out.println(&quot;========== 转置后的矩阵 ==========&quot;);&#10;        for (int i = 0; i &lt; transpose.length; i++) {&#10;            for (int j = 0; j &lt; transpose[i].length; j++) {&#10;                System.out.printf(&quot;%3d &quot;, transpose[i][j]);&#10;            }&#10;            System.out.println();&#10;        }&#10;        System.out.println(&quot;==================================&quot;);&#10;    }&#10;}"
  output-text=""
>

```java
/**
 * 二维数组本质与矩阵转置操作
 * @author MatNoble
 */
public class MatrixTransposeDemo {
    public static void main(String[] args) {
        // 2 行 3 列矩阵
        int[][] matrix = {
            { 1, 2, 3 },
            { 4, 5, 6 }
        };

        int rows = matrix.length;
        int cols = matrix[0].length;
        int[][] transpose = new int[cols][rows]; // 3 行 2 列

        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                transpose[j][i] = matrix[i][j];
            }
        }

        System.out.println("========== 转置后的矩阵 ==========");
        for (int i = 0; i < transpose.length; i++) {
            for (int j = 0; j < transpose[i].length; j++) {
                System.out.printf("%3d ", transpose[i][j]);
            }
            System.out.println();
        }
        System.out.println("==================================");
    }
}
```

</PracticeCard>

<PracticeCard
  :task-no="3"
  title="学生考试成绩统计分析器 (最高分/最低分/平均分/方差)"
  class-name="ScoreStatistics.java"
  template-code="/**&#10; * 随堂实操任务 7：学生考试成绩统计分析器 (最高分/最低分/平均分/方差)&#10; * @author MatNoble&#10; */&#10;public class ScoreStatistics {&#10;    public static void main(String[] args) {&#10;        double[] scores = { 88.5, 92.0, 76.5, 95.0, 68.0, 84.5, 91.0, 59.5 };&#10;&#10;        double max = scores[0];&#10;        double min = scores[0];&#10;        double sum = 0.0;&#10;&#10;        for (double s : scores) {&#10;            if (s &gt; max) max = s;&#10;            if (s &lt; min) min = s;&#10;            sum += s;&#10;        }&#10;        double avg = sum / scores.length;&#10;&#10;        // 计算方差&#10;        double varianceSum = 0.0;&#10;        for (double s : scores) {&#10;            varianceSum += Math.pow(s - avg, 2);&#10;        }&#10;        double variance = varianceSum / scores.length;&#10;        double stdDev = Math.sqrt(variance);&#10;&#10;        System.out.println(&quot;=========================================&quot;);&#10;        System.out.println(&quot;          班级成绩统计分析报告          &quot;);&#10;        System.out.println(&quot;-----------------------------------------&quot;);&#10;        System.out.printf(&quot;  * 样本人数 : %d 人\n&quot;, scores.length);&#10;        System.out.printf(&quot;  * 最高分   : %.2f 分\n&quot;, max);&#10;        System.out.printf(&quot;  * 最低分   : %.2f 分\n&quot;, min);&#10;        System.out.printf(&quot;  * 平均分   : %.2f 分\n&quot;, avg);&#10;        System.out.printf(&quot;  * 样本方差 : %.2f\n&quot;, variance);&#10;        System.out.printf(&quot;  * 标准差   : %.2f\n&quot;, stdDev);&#10;        System.out.println(&quot;=========================================&quot;);&#10;    }&#10;}"
  output-text=""
>

```java
/**
 * 随堂实操任务 7：学生考试成绩统计分析器 (最高分/最低分/平均分/方差)
 * @author MatNoble
 */
public class ScoreStatistics {
    public static void main(String[] args) {
        double[] scores = { 88.5, 92.0, 76.5, 95.0, 68.0, 84.5, 91.0, 59.5 };

        double max = scores[0];
        double min = scores[0];
        double sum = 0.0;

        for (double s : scores) {
            if (s > max) max = s;
            if (s < min) min = s;
            sum += s;
        }
        double avg = sum / scores.length;

        // 计算方差
        double varianceSum = 0.0;
        for (double s : scores) {
            varianceSum += Math.pow(s - avg, 2);
        }
        double variance = varianceSum / scores.length;
        double stdDev = Math.sqrt(variance);

        System.out.println("=========================================");
        System.out.println("          班级成绩统计分析报告          ");
        System.out.println("-----------------------------------------");
        System.out.printf("  * 样本人数 : %d 人\n", scores.length);
        System.out.printf("  * 最高分   : %.2f 分\n", max);
        System.out.printf("  * 最低分   : %.2f 分\n", min);
        System.out.printf("  * 平均分   : %.2f 分\n", avg);
        System.out.printf("  * 样本方差 : %.2f\n", variance);
        System.out.printf("  * 标准差   : %.2f\n", stdDev);
        System.out.println("=========================================");
    }
}
```

</PracticeCard>

