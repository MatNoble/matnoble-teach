---
layout: doc
title: 第 5 讲 课堂实操任务
breadcrumb: 课堂实操 (第 5 讲)
---

# 随堂实操任务清单 <span class="subtitle">第 5 讲</span>

> 💡 **操作指南**：点击每个任务右上角的 **“复制模板代码 📋”**，在您的 IDE（IntelliJ IDEA / VS Code）中打开对应类文件并补全核心代码。运行结果请参考下方的 **“预期控制台输出”** 进行自测比对。

[← 返回《Java程序设计》大纲](/courses/java-programming-2026-fall)

---

<PracticeCard
  :task-no="1"
  title="经典九九乘法表 (双重循环与格式化对齐)"
  class-name="MultiplicationTable.java"
  template-code="/**&#10; * 经典九九乘法表 (双重循环与格式化对齐)&#10; * @author MatNoble&#10; */&#10;public class MultiplicationTable {&#10;    public static void main(String[] args) {&#10;        System.out.println(&quot;================= 九九乘法表 =================&quot;);&#10;        for (int i = 1; i &lt;= 9; i++) {&#10;            for (int j = 1; j &lt;= i; j++) {&#10;                System.out.printf(&quot;%d*%d=%-2d  &quot;, j, i, (i * j));&#10;            }&#10;            System.out.println();&#10;        }&#10;        System.out.println(&quot;==============================================&quot;);&#10;    }&#10;}"
  output-text=""
>

```java
/**
 * 经典九九乘法表 (双重循环与格式化对齐)
 * @author MatNoble
 */
public class MultiplicationTable {
    public static void main(String[] args) {
        System.out.println("================= 九九乘法表 =================");
        for (int i = 1; i <= 9; i++) {
            for (int j = 1; j <= i; j++) {
                System.out.printf("%d*%d=%-2d  ", j, i, (i * j));
            }
            System.out.println();
        }
        System.out.println("==============================================");
    }
}
```

</PracticeCard>

<PracticeCard
  :task-no="2"
  title="1~100 素数筛选与循环提前终止 (break 与 Math.sqrt 优化)"
  class-name="PrimeSieveDemo.java"
  template-code="/**&#10; * 1~100 素数筛选与循环提前终止 (break 与 Math.sqrt 优化)&#10; * @author MatNoble&#10; */&#10;public class PrimeSieveDemo {&#10;    public static void main(String[] args) {&#10;        System.out.println(&quot;1 ~ 100 之间的所有素数:&quot;);&#10;        int count = 0;&#10;&#10;        for (int num = 2; num &lt;= 100; num++) {&#10;            boolean isPrime = true;&#10;            // 优化：只需检查到 sqrt(num)&#10;            for (int i = 2; i &lt;= Math.sqrt(num); i++) {&#10;                if (num % i == 0) {&#10;                    isPrime = false;&#10;                    break; // 发现因子，立即提前跳出内层循环&#10;                }&#10;            }&#10;            if (isPrime) {&#10;                System.out.printf(&quot;%3d &quot;, num);&#10;                count++;&#10;                if (count % 10 == 0) System.out.println();&#10;            }&#10;        }&#10;        System.out.printf(&quot;\n共找到 %d 个素数。\n&quot;, count);&#10;    }&#10;}"
  output-text=""
>

```java
/**
 * 1~100 素数筛选与循环提前终止 (break 与 Math.sqrt 优化)
 * @author MatNoble
 */
public class PrimeSieveDemo {
    public static void main(String[] args) {
        System.out.println("1 ~ 100 之间的所有素数:");
        int count = 0;

        for (int num = 2; num <= 100; num++) {
            boolean isPrime = true;
            // 优化：只需检查到 sqrt(num)
            for (int i = 2; i <= Math.sqrt(num); i++) {
                if (num % i == 0) {
                    isPrime = false;
                    break; // 发现因子，立即提前跳出内层循环
                }
            }
            if (isPrime) {
                System.out.printf("%3d ", num);
                count++;
                if (count % 10 == 0) System.out.println();
            }
        }
        System.out.printf("\n共找到 %d 个素数。\n", count);
    }
}
```

</PracticeCard>

<PracticeCard
  :task-no="3"
  title="控制台猜数字互动小游戏 (while 循环与二分查找体验)"
  class-name="NumberGuessGame.java"
  template-code="import java.util.Random;&#10;import java.util.Scanner;&#10;&#10;/**&#10; * 随堂实操任务 5：控制台猜数字互动小游戏 (while 循环与二分查找体验)&#10; * @author MatNoble&#10; */&#10;public class NumberGuessGame {&#10;    public static void main(String[] args) {&#10;        Scanner scanner = new Scanner(System.in);&#10;        Random random = new Random();&#10;        int target = random.nextInt(100) + 1; // 1~100 随机数&#10;        int attempts = 0;&#10;&#10;        System.out.println(&quot;=========================================&quot;);&#10;        System.out.println(&quot;       猜数字小游戏 (1 ~ 100)        &quot;);&#10;        System.out.println(&quot;=========================================&quot;);&#10;&#10;        while (true) {&#10;            System.out.print(&quot;请输入你猜测的数字: &quot;);&#10;            int guess = scanner.nextInt();&#10;            attempts++;&#10;&#10;            // ===== TODO: 【实操任务 3】请在此补全代码 =====&#10;            // 提示: while 循环内部猜测比对与 break 退出逻辑&#10;            // &#10;            // ============================================&#10;        }&#10;    }&#10;}"
  output-text="=========================================&#10;       猜数字小游戏 (1 ~ 100)        &#10;=========================================&#10;请输入你猜测的数字: 50&#10;太大了！再小一点。&#10;请输入你猜测的数字: 25&#10;太小了！再大一点。&#10;请输入你猜测的数字: 37&#10;太小了！再大一点。&#10;请输入你猜测的数字: 43&#10;-----------------------------------------&#10;恭喜你猜中了！目标数字就是: 43&#10;总共尝试次数: 4 次&#10;========================================="
>

```java
import java.util.Random;
import java.util.Scanner;

/**
 * 随堂实操任务 5：控制台猜数字互动小游戏 (while 循环与二分查找体验)
 * @author MatNoble
 */
public class NumberGuessGame {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        Random random = new Random();
        int target = random.nextInt(100) + 1; // 1~100 随机数
        int attempts = 0;

        System.out.println("=========================================");
        System.out.println("       猜数字小游戏 (1 ~ 100)        ");
        System.out.println("=========================================");

        while (true) {
            System.out.print("请输入你猜测的数字: ");
            int guess = scanner.nextInt();
            attempts++;

            // ===== TODO: 【实操任务 3】请在此补全代码 =====
            // 提示: while 循环内部猜测比对与 break 退出逻辑
            // 
            // ============================================
        }
    }
}
```

</PracticeCard>

