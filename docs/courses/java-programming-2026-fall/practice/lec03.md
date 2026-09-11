---
layout: doc
title: 第 3 讲 课堂实操任务
breadcrumb: 课堂实操 (第 3 讲)
---

# 随堂实操任务清单 <span class="subtitle">第 3 讲</span>

> 💡 **操作指南**：点击每个任务右上角的 **“复制模板代码 📋”**，在您的 IDE（IntelliJ IDEA / VS Code）中打开对应类文件并补全核心代码。运行结果请参考下方的 **“预期控制台输出”** 进行自测比对。

[← 返回《Java程序设计》大纲](/courses/java-programming-2026-fall)

---

<PracticeCard
  :task-no="1"
  title="Scanner 换行符残留陷阱与标准解决方案"
  class-name="ScannerTrapDemo.java"
  template-code="import java.util.Scanner;&#10;&#10;/**&#10; * Scanner 换行符残留陷阱与标准解决方案&#10; * @author MatNoble&#10; */&#10;public class ScannerTrapDemo {&#10;    public static void main(String[] args) {&#10;        Scanner scanner = new Scanner(System.in);&#10;&#10;        System.out.print(&quot;请输入您的年龄: &quot;);&#10;        int age = scanner.nextInt();&#10;        &#10;        // 吃掉残留的换行符&#10;        scanner.nextLine();&#10;&#10;        System.out.print(&quot;请输入您的座右铭: &quot;);&#10;        String motto = scanner.nextLine();&#10;&#10;        System.out.printf(&quot;登记完成 -&gt; 年龄: %d | 座右铭: \&quot;%s\&quot;\n&quot;, age, motto);&#10;    }&#10;}"
  output-text=""
>

```java
import java.util.Scanner;

/**
 * Scanner 换行符残留陷阱与标准解决方案
 * @author MatNoble
 */
public class ScannerTrapDemo {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("请输入您的年龄: ");
        int age = scanner.nextInt();
        
        // 吃掉残留的换行符
        scanner.nextLine();

        System.out.print("请输入您的座右铭: ");
        String motto = scanner.nextLine();

        System.out.printf("登记完成 -> 年龄: %d | 座右铭: \"%s\"\n", age, motto);
    }
}
```

</PracticeCard>

<PracticeCard
  :task-no="2"
  title="健壮性控制台输入与非法字符拦截"
  class-name="RobustInputDemo.java"
  template-code="import java.util.Scanner;&#10;&#10;/**&#10; * 健壮性控制台输入与非法字符拦截&#10; * @author MatNoble&#10; */&#10;public class RobustInputDemo {&#10;    public static void main(String[] args) {&#10;        Scanner scanner = new Scanner(System.in);&#10;        int score = -1;&#10;&#10;        while (true) {&#10;            System.out.print(&quot;请输入有效分数 (0~100): &quot;);&#10;            if (scanner.hasNextInt()) {&#10;                score = scanner.nextInt();&#10;                if (score &gt;= 0 &amp;&amp; score &lt;= 100) {&#10;                    break; // 输入合法，退出重试循环&#10;                }&#10;                System.out.println(&quot;[警告] 分数必须在 0 到 100 之间！&quot;);&#10;            } else {&#10;                String invalidToken = scanner.next();&#10;                System.out.printf(&quot;[错误] \&quot;%s\&quot; 不是有效的整数，请重新输入！\n&quot;, invalidToken);&#10;            }&#10;        }&#10;&#10;        System.out.printf(&quot;[成功] 录入分数: %d\n&quot;, score);&#10;    }&#10;}"
  output-text=""
>

```java
import java.util.Scanner;

/**
 * 健壮性控制台输入与非法字符拦截
 * @author MatNoble
 */
public class RobustInputDemo {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int score = -1;

        while (true) {
            System.out.print("请输入有效分数 (0~100): ");
            if (scanner.hasNextInt()) {
                score = scanner.nextInt();
                if (score >= 0 && score <= 100) {
                    break; // 输入合法，退出重试循环
                }
                System.out.println("[警告] 分数必须在 0 到 100 之间！");
            } else {
                String invalidToken = scanner.next();
                System.out.printf("[错误] \"%s\" 不是有效的整数，请重新输入！\n", invalidToken);
            }
        }

        System.out.printf("[成功] 录入分数: %d\n", score);
    }
}
```

</PracticeCard>

<PracticeCard
  :task-no="3"
  title="学生成绩等级交互评定系统"
  class-name="GradeEvaluationSystem.java"
  template-code="import java.util.Scanner;&#10;&#10;/**&#10; * 随堂实操任务 3：学生成绩等级交互评定系统&#10; * @author MatNoble&#10; */&#10;public class GradeEvaluationSystem {&#10;    public static void main(String[] args) {&#10;        Scanner scanner = new Scanner(System.in);&#10;        System.out.println(&quot;=========================================&quot;);&#10;        System.out.println(&quot;        学生成绩评定与统计系统        &quot;);&#10;        System.out.println(&quot;=========================================&quot;);&#10;&#10;        System.out.print(&quot;请输入学生姓名: &quot;);&#10;        String name = scanner.nextLine().trim();&#10;&#10;        System.out.print(&quot;请输入期末卷面成绩 (0~100): &quot;);&#10;        double score = scanner.nextDouble();&#10;&#10;        String grade;&#10;        // ===== TODO: 【实操任务 3】请在此补全代码 =====&#10;        // 提示: 多分支 if-else 成绩等级划分 (90分及以上优秀，80分及以上良好，70分及以上中等，60分及以上及格，否则不及格)&#10;        // &#10;        // ============================================&#10;&#10;        System.out.println(&quot;-----------------------------------------&quot;);&#10;        System.out.printf(&quot;  * 学生姓名 : %-10s\n&quot;, name);&#10;        System.out.printf(&quot;  * 卷面得分 : %6.2f 分\n&quot;, score);&#10;        System.out.printf(&quot;  * 等级评定 : %s\n&quot;, grade);&#10;        System.out.println(&quot;=========================================&quot;);&#10;    }&#10;}"
  output-text="=========================================&#10;        学生成绩评定与统计系统        &#10;=========================================&#10;请输入学生姓名: 张三&#10;请输入期末卷面成绩 (0~100): 88.5&#10;-----------------------------------------&#10;  * 学生姓名 : 张三        &#10;  * 卷面得分 :  88.50 分&#10;  * 等级评定 : 良好 (B)&#10;========================================="
>

```java
import java.util.Scanner;

/**
 * 随堂实操任务 3：学生成绩等级交互评定系统
 * @author MatNoble
 */
public class GradeEvaluationSystem {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.println("=========================================");
        System.out.println("        学生成绩评定与统计系统        ");
        System.out.println("=========================================");

        System.out.print("请输入学生姓名: ");
        String name = scanner.nextLine().trim();

        System.out.print("请输入期末卷面成绩 (0~100): ");
        double score = scanner.nextDouble();

        String grade;
        // ===== TODO: 【实操任务 3】请在此补全代码 =====
        // 提示: 多分支 if-else 成绩等级划分 (90分及以上优秀，80分及以上良好，70分及以上中等，60分及以上及格，否则不及格)
        // 
        // ============================================

        System.out.println("-----------------------------------------");
        System.out.printf("  * 学生姓名 : %-10s\n", name);
        System.out.printf("  * 卷面得分 : %6.2f 分\n", score);
        System.out.printf("  * 等级评定 : %s\n", grade);
        System.out.println("=========================================");
    }
}
```

</PracticeCard>

