---
layout: doc
title: 第 4 讲 课堂实操任务
breadcrumb: 课堂实操 (第 4 讲)
---

# 随堂实操任务清单 <span class="subtitle">第 4 讲</span>

> 💡 **操作指南**：点击每个任务右上角的 **“复制模板代码 📋”**，在您的 IDE（IntelliJ IDEA / VS Code）中打开对应类文件并补全核心代码。运行结果请参考下方的 **“预期控制台输出”** 进行自测比对。

[← 返回《Java程序设计》大纲](/courses/java-programming-2026-fall)

---

<PracticeCard
  :task-no="1"
  title="状态位掩码提取与逻辑运算演示"
  class-name="BitmaskDemo.java"
  template-code="/**&#10; * 状态位掩码提取与逻辑运算演示&#10; * @author MatNoble&#10; */&#10;public class BitmaskDemo {&#10;    public static void main(String[] args) {&#10;        // 定义权限掩码&#10;        int READ_MASK    = 0b0001; // 读权限&#10;        int WRITE_MASK   = 0b0010; // 写权限&#10;        int EXECUTE_MASK = 0b0100; // 执行权限&#10;&#10;        // 用户拥有读和执行权限&#10;        int userPermission = READ_MASK | EXECUTE_MASK; // 0b0101 = 5&#10;&#10;        System.out.println(&quot;用户权限掩码值: &quot; + userPermission);&#10;        System.out.println(&quot;是否具备读权限: &quot; + ((userPermission &amp; READ_MASK) != 0));&#10;        System.out.println(&quot;是否具备写权限: &quot; + ((userPermission &amp; WRITE_MASK) != 0));&#10;        System.out.println(&quot;是否具备执行权限: &quot; + ((userPermission &amp; EXECUTE_MASK) != 0));&#10;    }&#10;}"
  output-text=""
>

```java
/**
 * 状态位掩码提取与逻辑运算演示
 * @author MatNoble
 */
public class BitmaskDemo {
    public static void main(String[] args) {
        // 定义权限掩码
        int READ_MASK    = 0b0001; // 读权限
        int WRITE_MASK   = 0b0010; // 写权限
        int EXECUTE_MASK = 0b0100; // 执行权限

        // 用户拥有读和执行权限
        int userPermission = READ_MASK | EXECUTE_MASK; // 0b0101 = 5

        System.out.println("用户权限掩码值: " + userPermission);
        System.out.println("是否具备读权限: " + ((userPermission & READ_MASK) != 0));
        System.out.println("是否具备写权限: " + ((userPermission & WRITE_MASK) != 0));
        System.out.println("是否具备执行权限: " + ((userPermission & EXECUTE_MASK) != 0));
    }
}
```

</PracticeCard>

<PracticeCard
  :task-no="2"
  title="现代 Java 14+ 增强 switch 表达式与传统 switch 对比"
  class-name="ModernSwitchDemo.java"
  template-code="/**&#10; * 现代 Java 14+ 增强 switch 表达式与传统 switch 对比&#10; * @author MatNoble&#10; */&#10;public class ModernSwitchDemo {&#10;    public static void main(String[] args) {&#10;        int dayOfWeek = 3;&#10;&#10;        // 现代箭头语法 switch 表达式 (无穿透，自动 break，支持返回值)&#10;        String dayName = switch (dayOfWeek) {&#10;            case 1 -&gt; &quot;星期一 (Monday)&quot;;&#10;            case 2 -&gt; &quot;星期二 (Tuesday)&quot;;&#10;            case 3 -&gt; &quot;星期三 (Wednesday)&quot;;&#10;            case 4 -&gt; &quot;星期四 (Thursday)&quot;;&#10;            case 5 -&gt; &quot;星期五 (Friday)&quot;;&#10;            case 6, 7 -&gt; &quot;周末 (Weekend)&quot;;&#10;            default -&gt; &quot;无效的星期代码&quot;;&#10;        };&#10;&#10;        System.out.printf(&quot;星期代码 %d 对应: %s\n&quot;, dayOfWeek, dayName);&#10;    }&#10;}"
  output-text=""
>

```java
/**
 * 现代 Java 14+ 增强 switch 表达式与传统 switch 对比
 * @author MatNoble
 */
public class ModernSwitchDemo {
    public static void main(String[] args) {
        int dayOfWeek = 3;

        // 现代箭头语法 switch 表达式 (无穿透，自动 break，支持返回值)
        String dayName = switch (dayOfWeek) {
            case 1 -> "星期一 (Monday)";
            case 2 -> "星期二 (Tuesday)";
            case 3 -> "星期三 (Wednesday)";
            case 4 -> "星期四 (Thursday)";
            case 5 -> "星期五 (Friday)";
            case 6, 7 -> "周末 (Weekend)";
            default -> "无效的星期代码";
        };

        System.out.printf("星期代码 %d 对应: %s\n", dayOfWeek, dayName);
    }
}
```

</PracticeCard>

<PracticeCard
  :task-no="3"
  title="商场会员梯度折扣计算器"
  class-name="DiscountCalculator.java"
  template-code="import java.util.Scanner;&#10;&#10;/**&#10; * 随堂实操任务 4：商场会员梯度折扣计算器&#10; * @author MatNoble&#10; */&#10;public class DiscountCalculator {&#10;    public static void main(String[] args) {&#10;        Scanner scanner = new Scanner(System.in);&#10;        System.out.println(&quot;=========================================&quot;);&#10;        System.out.println(&quot;          商场购物阶梯折扣计算器          &quot;);&#10;        System.out.println(&quot;=========================================&quot;);&#10;&#10;        System.out.print(&quot;请输入消费金额 (元): &quot;);&#10;        double amount = scanner.nextDouble();&#10;&#10;        System.out.print(&quot;请输入会员等级 (1: 普通, 2: 黄金, 3: 钻石): &quot;);&#10;        int memberLevel = scanner.nextInt();&#10;&#10;        // ===== TODO: 【实操任务 3 - 挖空 1】请在此补全代码 =====&#10;        // 提示: 使用 switch 表达式根据会员等级计算折扣率 (等级1为0.95，等级2为0.85，等级3为0.75，默认1.00)&#10;        // &#10;        // ============================================&#10;&#10;        // 满减优惠额外规则&#10;        double finalAmount = amount * discountRate;&#10;        // ===== TODO: 【实操任务 3 - 挖空 2】请在此补全代码 =====&#10;        // 提示: 满减优惠逻辑：折后满 500 元立减 50 元&#10;        // &#10;        // ============================================&#10;&#10;        System.out.println(&quot;-----------------------------------------&quot;);&#10;        System.out.printf(&quot;  * 原始金额 : %.2f 元\n&quot;, amount);&#10;        System.out.printf(&quot;  * 会员折扣 : %.0f %%\n&quot;, (1 - discountRate) * 100);&#10;        System.out.printf(&quot;  * 实付金额 : %.2f 元\n&quot;, Math.max(0, finalAmount));&#10;        System.out.println(&quot;=========================================&quot;);&#10;    }&#10;}"
  output-text="=========================================&#10;          商场购物阶梯折扣计算器          &#10;=========================================&#10;请输入消费金额 (元): 600&#10;请输入会员等级 (1: 普通, 2: 黄金, 3: 钻石): 2&#10;-----------------------------------------&#10;  * 原始金额 : 600.00 元&#10;  * 会员折扣 : 15 %&#10;  * 实付金额 : 460.00 元&#10;========================================="
>

```java
import java.util.Scanner;

/**
 * 随堂实操任务 4：商场会员梯度折扣计算器
 * @author MatNoble
 */
public class DiscountCalculator {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.println("=========================================");
        System.out.println("          商场购物阶梯折扣计算器          ");
        System.out.println("=========================================");

        System.out.print("请输入消费金额 (元): ");
        double amount = scanner.nextDouble();

        System.out.print("请输入会员等级 (1: 普通, 2: 黄金, 3: 钻石): ");
        int memberLevel = scanner.nextInt();

        // ===== TODO: 【实操任务 3 - 挖空 1】请在此补全代码 =====
        // 提示: 使用 switch 表达式根据会员等级计算折扣率 (等级1为0.95，等级2为0.85，等级3为0.75，默认1.00)
        // 
        // ============================================

        // 满减优惠额外规则
        double finalAmount = amount * discountRate;
        // ===== TODO: 【实操任务 3 - 挖空 2】请在此补全代码 =====
        // 提示: 满减优惠逻辑：折后满 500 元立减 50 元
        // 
        // ============================================

        System.out.println("-----------------------------------------");
        System.out.printf("  * 原始金额 : %.2f 元\n", amount);
        System.out.printf("  * 会员折扣 : %.0f %%\n", (1 - discountRate) * 100);
        System.out.printf("  * 实付金额 : %.2f 元\n", Math.max(0, finalAmount));
        System.out.println("=========================================");
    }
}
```

</PracticeCard>

