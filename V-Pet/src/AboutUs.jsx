import NavButton from './NavButton';

function AboutUsPage() {
    return (
        <div id="aboutus-background">
        <NavButton name="Home" target="/Select" className="homeBtn"/>
            <div id="about-us">
                <section>
                    The birth of the idea:<br />
                    <br />
                    It all started with coffee and a little push:<br />
                    “Hey, what if we made a game about cute little animals?” <br />
                    Quick math: two weeks. Us: “What could possibly go wrong?” 😅
                </section>

                <section>
                    The first chaos:<br />
                    <br />
                    In the first days, everything that could break, broke. Code crashed, images disappeared, <br />
                    and somehow Márk always forgot where he put the project folder.<br />
                    But we always ended up laughing, because crying just wasn’t as fun.<br />
                </section>

                <section>
                    Small victories:<br />
                    <br />
                    The first character that finally appeared on the screen was a real celebration. <br />
                    🎉 A little crooked, a little buggy, but still: alive! That’s when we knew something was happening, something was working.<br />
                </section>

                <section>
                    Teamwork 101:<br />
                    <br />
                    Turns out three people see the same problem in three completely different ways. <br />
                    Peti loved maxing everything out, <br />
                    Domi double-checked every tiny detail 1000 times, <br />
                    and Márk… well, Márk mostly tried to keep us motivated with coffee. <br />
                    But somehow we always found common ground.<br />
                </section>

                <section>
                    The big polishing phase:<br />
                    <br />
                    The following days we adjusted character positions, the background, the buttons, <br />
                    and of course made sure the game didn’t collapse after the first ten clicks. <br />
                    This was truly the “Art meets Chaos” phase.<br />
                </section>

                <section>
                    The final joy:<br />
                    <br />
                    When after two weeks we finally tested it together and it actually worked, <br />
                    all the tiredness, every bug, every missing image, every crash disappeared at once. <br />
                    We just laughed and clapped like crazy xd<br />
                </section>

                <section>
                    The lesson:<br />
                    <br />
                    Two weeks might sound short, but with an idea, enthusiasm, and a touch of madness, <br />
                    you can still create something special in a short time. <br />
                    And of course: never forget coffee. Always have coffee. ☕<br />
                </section>
            </div>
        </div>
    )
}

export default AboutUsPage