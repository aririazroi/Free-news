// Article data structure
const articles = [
    {
        id: 1,
        title: "Swiss Voters Reject 50% Inheritance Tax on Wealthy",
        summary: "Swiss voters today rejected a Young Socialists proposal to levy 50% on inheritances and gifts over 50 million francs, 79% against, which aimed to raise 4-6 billion for climate action.",
        category: "European Politics • Switzerland",
        image: "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800",
        trafficLightStatus: "green",
        misleadingScore: 23,
        content: `
            <p>Swiss voters have decisively rejected a proposal by the Young Socialists to introduce a 50% inheritance tax on estates and gifts exceeding 50 million Swiss francs. The referendum, held on Sunday, saw 79% of voters oppose the measure.</p>
            
            <p>The proposal, which was part of the "Inheritance Tax Initiative," aimed to raise between 4 and 6 billion Swiss francs annually to fund climate action initiatives. Supporters argued that the tax would help address wealth inequality and provide funding for environmental programs.</p>
            
            <p>Opponents of the measure, including business groups and center-right political parties, argued that the tax would discourage entrepreneurship and investment in Switzerland. They also raised concerns about the potential impact on family businesses and the country's competitive position.</p>
            
            <p>The rejection comes as Switzerland continues to debate various tax and climate policies. The country has set ambitious climate targets, including achieving net-zero emissions by 2050, but has struggled to find consensus on how to fund these initiatives.</p>
            
            <p>Political analysts note that the overwhelming rejection reflects Switzerland's traditional resistance to wealth taxes and its preference for direct democracy, where voters have the final say on major policy changes.</p>
            
            <p>The Young Socialists expressed disappointment with the result but vowed to continue pushing for wealth redistribution and climate action through other means. The party's leader stated that the fight for social and environmental justice would continue.</p>
        `,
        related: [
            "Ukrainian Drone Strikes Caspian Pipeline",
            "Renowned Playwright Stoppard Dies at 88",
            "UN Urges Israel Torture Investigation"
        ]
    },
    {
        id: 2,
        title: "Kazakhstan Protests Ukrainian Drone Strike on Black Sea Oil Terminal",
        summary: "Kazakhstan has filed a formal protest with Ukraine after a drone strike targeted an oil terminal in the Black Sea region, raising concerns about regional stability.",
        category: "Oil and Gas Sector • Kazakhstan",
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800",
        trafficLightStatus: "yellow",
        misleadingScore: 45,
        content: `
            <p>Kazakhstan's foreign ministry has issued a formal protest to Ukraine following a drone strike that targeted an oil terminal facility in the Black Sea region. The incident, which occurred early Monday morning, has raised tensions between the two countries.</p>
            
            <p>According to Kazakh officials, the strike caused significant damage to storage facilities and temporarily halted operations at the terminal. No casualties were reported, but the economic impact is expected to be substantial.</p>
            
            <p>Ukraine has not officially claimed responsibility for the strike, but sources within the Ukrainian military have indicated that the target was part of a broader strategy to disrupt Russian energy infrastructure. The terminal in question has been used to transport oil to Russian ports, which has been a point of contention.</p>
            
            <p>Kazakhstan, which maintains a delicate balancing act between Russia and Western powers, has called for restraint and dialogue. The country's president has emphasized the importance of maintaining regional stability and avoiding escalation.</p>
            
            <p>Energy analysts note that the strike highlights the vulnerability of critical infrastructure in the region and could have broader implications for global oil markets. Kazakhstan is a significant oil producer and exporter, and any disruption to its export capabilities could affect global supply.</p>
            
            <p>The incident comes amid ongoing tensions in the region following Russia's invasion of Ukraine. Kazakhstan has sought to maintain neutrality while continuing to trade with both sides, a position that has become increasingly difficult to maintain.</p>
        `
    },
    {
        id: 3,
        title: "Musk Says Optimus Robots Will Build Themselves in Self-Replicating Factories",
        summary: "Elon Musk announced that Tesla's Optimus humanoid robots will eventually be capable of building themselves in fully automated factories, a vision that has sparked both excitement and skepticism.",
        category: "Elon Musk • United States",
        image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800",
        trafficLightStatus: "red",
        misleadingScore: 78,
        content: `
            <p>During a presentation at Tesla's annual shareholder meeting, CEO Elon Musk unveiled an ambitious vision for the company's Optimus humanoid robot program. Musk stated that the robots would eventually be capable of building themselves in fully automated, self-replicating factories.</p>
            
            <p>"The goal is to create a factory where Optimus robots build Optimus robots," Musk told the audience. "This is the path to true automation and the future of manufacturing."</p>
            
            <p>The announcement has generated significant discussion among robotics experts and industry analysts. While some see it as a natural evolution of automation technology, others have raised concerns about the feasibility and implications of such a system.</p>
            
            <p>Critics point out that self-replicating systems face numerous technical challenges, including the need for extremely precise manufacturing capabilities, quality control, and the ability to handle complex assembly tasks. Current robotics technology, while advanced, is still far from achieving this level of autonomy.</p>
            
            <p>Musk acknowledged that the vision is long-term, estimating that it could take 5-10 years to achieve. However, he emphasized Tesla's track record of achieving ambitious goals, pointing to the company's success in electric vehicles and battery technology.</p>
            
            <p>The announcement also raises questions about the economic and social implications of fully automated manufacturing. Some economists have warned about potential job displacement, while others argue that such technology could lead to lower costs and increased productivity.</p>
            
            <p>Tesla has been developing the Optimus robot since 2021, with the goal of creating a general-purpose humanoid robot that can perform a wide range of tasks. The company has shown several prototypes, but a production version has yet to be released.</p>
        `
    },
    {
        id: 4,
        title: "Egypt trains hundreds of Palestinians for future Gaza police force",
        summary: "Egypt has begun training hundreds of Palestinians in preparation for establishing a police force in Gaza, as part of post-conflict reconstruction efforts.",
        category: "Middle East • Egypt",
        image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800",
        trafficLightStatus: "yellow",
        misleadingScore: 52,
        content: `
            <p>Egypt has initiated a training program for hundreds of Palestinian recruits who are being prepared to serve in a future police force for Gaza. The program, which began last month, is part of broader efforts to prepare for post-conflict governance and security in the region.</p>
            
            <p>The training is taking place at facilities in Egypt and focuses on basic law enforcement skills, community policing, and maintaining public order. Egyptian officials have emphasized that the program is designed to support stability and security in Gaza once the current conflict ends.</p>
            
            <p>The initiative has been coordinated with international partners and is seen as a crucial step in preparing for the eventual reconstruction and governance of Gaza. However, the program has also raised questions about the political implications and who will ultimately control the security forces.</p>
            
            <p>Palestinian Authority officials have expressed support for the training program, viewing it as necessary preparation for assuming governance responsibilities. However, some factions have raised concerns about the potential for external influence over Gaza's security apparatus.</p>
            
            <p>International observers note that the success of any future police force will depend on broader political agreements about Gaza's governance. The current conflict has complicated these discussions, and many questions remain unanswered about the post-conflict political structure.</p>
            
            <p>The training program is expected to continue for several months, with additional recruits potentially joining in future cohorts. Egyptian officials have stated that the program will adapt based on the evolving situation in Gaza and the broader region.</p>
        `
    },
    {
        id: 5,
        title: "Netanyahu Requests Pardon from President Herzog",
        summary: "Israeli Prime Minister Benjamin Netanyahu has formally requested a pardon from President Isaac Herzog, according to sources close to the president's office.",
        category: "Israel-Gaza • Politics",
        image: "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800",
        trafficLightStatus: "red",
        misleadingScore: 82,
        content: `
            <p>Israeli Prime Minister Benjamin Netanyahu has submitted a formal request for a pardon to President Isaac Herzog, according to sources within the president's office. The request comes amid ongoing legal proceedings against Netanyahu and growing political pressure.</p>
            
            <p>Netanyahu is currently facing charges of bribery, fraud, and breach of trust in three separate cases. The legal proceedings have been ongoing for several years, and Netanyahu has consistently maintained his innocence.</p>
            
            <p>The request for a pardon is highly unusual for a sitting prime minister and has sparked significant political controversy. Opposition leaders have criticized the move, arguing that it undermines the rule of law and the independence of the judiciary.</p>
            
            <p>President Herzog's office has confirmed that a request was received but has not commented on the substance of the request or the likelihood of it being granted. The president has the constitutional authority to grant pardons, but such powers are typically used sparingly and in exceptional circumstances.</p>
            
            <p>Legal experts note that granting a pardon to a sitting prime minister would be unprecedented in Israeli history and could have significant implications for the country's democratic institutions. The move would likely face legal challenges and could further polarize an already divided political landscape.</p>
            
            <p>The request comes at a time when Netanyahu's government is facing multiple challenges, including the ongoing conflict in Gaza, economic pressures, and internal political divisions. The legal cases have been a persistent source of political tension throughout his tenure.</p>
        `
    },
    {
        id: 6,
        title: "Ukrainian Drone Strikes Caspian Pipeline",
        summary: "Ukrainian forces have launched a drone strike on a major oil pipeline in the Caspian region, marking an escalation in the conflict's reach.",
        category: "Ukraine War • Energy",
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800",
        trafficLightStatus: "green",
        misleadingScore: 31,
        content: `
            <p>Ukrainian military forces have successfully targeted a major oil pipeline in the Caspian region using long-range drones, according to Ukrainian defense officials. The strike represents a significant expansion of Ukraine's ability to target Russian energy infrastructure.</p>
            
            <p>The pipeline, which transports oil from the Caspian Sea region to Russian ports, was hit in the early hours of Tuesday morning. Ukrainian officials claim that the strike caused significant damage and temporarily halted operations.</p>
            
            <p>The attack demonstrates Ukraine's growing capability to strike targets at greater distances, using advanced drone technology. This has been a key focus of Ukrainian military development as the conflict has progressed.</p>
            
            <p>Russian officials have confirmed that an attack occurred but have downplayed the extent of the damage. They have also vowed to strengthen defenses around critical infrastructure facilities.</p>
            
            <p>Energy analysts note that while the immediate impact on global oil markets may be limited, the attack highlights the vulnerability of energy infrastructure in the region. The Caspian region is a significant source of oil and gas, and any sustained disruption could have broader implications.</p>
            
            <p>The strike comes as Ukraine continues to seek ways to pressure Russia's economy and military capabilities. Targeting energy infrastructure has become an increasingly important part of Ukraine's strategy as the conflict has evolved.</p>
        `
    },
    {
        id: 7,
        title: "Renowned Playwright Stoppard Dies at 88",
        summary: "Tom Stoppard, the celebrated playwright known for works like 'Rosencrantz and Guildenstern Are Dead' and 'The Coast of Utopia,' has passed away at the age of 88.",
        category: "Arts • Obituaries",
        image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800",
        trafficLightStatus: "green",
        misleadingScore: 15,
        content: `
            <p>Tom Stoppard, one of the most celebrated playwrights of the 20th and 21st centuries, has died at the age of 88. His family confirmed that he passed away peacefully at his home in London.</p>
            
            <p>Stoppard was best known for his intellectually challenging plays that combined wit, wordplay, and philosophical depth. His breakthrough work, "Rosencrantz and Guildenstern Are Dead," reimagined Shakespeare's "Hamlet" from the perspective of two minor characters and established him as a major voice in contemporary theater.</p>
            
            <p>Throughout his career, Stoppard wrote numerous acclaimed plays, including "Arcadia," "The Real Thing," "Jumpers," and "The Coast of Utopia," a trilogy about 19th-century Russian intellectuals. He also wrote screenplays, including "Shakespeare in Love," which won an Academy Award for Best Original Screenplay.</p>
            
            <p>Born Tomáš Straussler in Czechoslovakia in 1937, Stoppard's family fled the country ahead of the Nazi invasion, eventually settling in England. He began his career as a journalist before turning to playwriting in the 1960s.</p>
            
            <p>Stoppard's work was characterized by its intellectual rigor, linguistic playfulness, and exploration of complex philosophical and political themes. He was known for his ability to make difficult concepts accessible through humor and dramatic tension.</p>
            
            <p>The theater world has mourned the loss of one of its greatest voices. Tributes have poured in from actors, directors, and fellow playwrights, all celebrating Stoppard's contributions to the art form and his unique ability to challenge and entertain audiences.</p>
        `
    },
    {
        id: 8,
        title: "UN Urges Israel Torture Investigation",
        summary: "The United Nations has called for an independent investigation into allegations of torture and mistreatment of Palestinian detainees by Israeli forces.",
        category: "UN • Human Rights",
        image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800",
        trafficLightStatus: "yellow",
        misleadingScore: 48,
        content: `
            <p>The United Nations has issued a formal call for an independent investigation into allegations of torture and mistreatment of Palestinian detainees by Israeli security forces. The request comes following reports from human rights organizations documenting numerous cases of abuse.</p>
            
            <p>UN officials have expressed "grave concern" about the allegations, which include reports of physical abuse, psychological pressure, and denial of basic rights. The organization has called on Israel to cooperate fully with any investigation and to ensure that detainees are treated in accordance with international law.</p>
            
            <p>Israeli officials have denied the allegations and stated that all detainees are treated according to Israeli law and international standards. They have also criticized the UN for what they describe as a biased approach to the conflict.</p>
            
            <p>Human rights organizations have documented hundreds of cases of alleged mistreatment since the beginning of the current conflict. These reports have included accounts from released detainees, medical professionals, and legal advocates.</p>
            
            <p>The call for an investigation comes amid growing international concern about the treatment of detainees and the broader humanitarian situation in the region. Several countries have echoed the UN's call for transparency and accountability.</p>
            
            <p>Legal experts note that if the allegations are substantiated, they could constitute violations of international humanitarian law and human rights law. However, conducting a thorough investigation in the current conflict environment presents significant challenges.</p>
        `
    },
    {
        id: 9,
        title: "Budget Analysis Shows Significant Changes in 2012 Policy",
        summary: "A comprehensive analysis of the 2012 budget reveals significant policy shifts that continue to impact current economic conditions.",
        category: "US Politics • Economy",
        image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800",
        trafficLightStatus: "red",
        misleadingScore: 67,
        content: `
            <p>A detailed analysis of the 2012 federal budget has revealed significant policy changes that continue to shape the current economic landscape. The budget, passed during a period of intense political debate, included major shifts in spending priorities and tax policy.</p>
            
            <p>The analysis, conducted by a non-partisan research organization, examined the long-term impacts of decisions made in 2012. Key findings include substantial changes to defense spending, social programs, and tax structures that have had lasting effects on the economy.</p>
            
            <p>One of the most significant changes was the implementation of automatic spending cuts, known as sequestration, which were designed to reduce the federal deficit. These cuts affected a wide range of government programs and services.</p>
            
            <p>The budget also included major changes to tax policy, including extensions of certain tax cuts and the introduction of new tax provisions. These changes have had complex effects on different segments of the population and the economy as a whole.</p>
            
            <p>Economic analysts note that the 2012 budget decisions continue to influence current policy debates, particularly around issues of deficit reduction, government spending, and tax policy. The long-term consequences of these decisions are still being felt today.</p>
            
            <p>The analysis has sparked renewed debate about fiscal policy and the appropriate role of government spending in economic management. Different political perspectives have interpreted the findings in various ways, reflecting ongoing divisions over economic policy.</p>
        `
    },
    {
        id: 10,
        title: "European Union Announces New Climate Targets",
        summary: "The European Union has unveiled ambitious new climate targets, aiming for a 55% reduction in emissions by 2030.",
        category: "European Union • Climate",
        image: "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800",
        trafficLightStatus: "green",
        misleadingScore: 28,
        content: `
            <p>The European Union has announced a comprehensive set of new climate targets, including a commitment to reduce greenhouse gas emissions by 55% by 2030 compared to 1990 levels. The announcement represents a significant acceleration of the bloc's climate ambitions.</p>
            
            <p>The new targets are part of the EU's broader "Fit for 55" package, which includes a wide range of policies and regulations designed to achieve carbon neutrality by 2050. The package covers everything from energy production to transportation and agriculture.</p>
            
            <p>Key components of the plan include increased investment in renewable energy, stricter emissions standards for vehicles, and new regulations for industries. The EU has also committed to significant funding to support the transition, particularly for member states that face greater economic challenges.</p>
            
            <p>Environmental groups have welcomed the announcement but have also called for even more ambitious targets. They argue that the science demands faster action to address the climate crisis.</p>
            
            <p>Business groups have expressed mixed reactions, with some welcoming the clarity and predictability of the targets, while others have raised concerns about the economic costs and competitiveness implications.</p>
            
            <p>The announcement comes ahead of major international climate negotiations, where the EU hopes to encourage other major economies to adopt similar ambitious targets. The bloc has positioned itself as a global leader in climate action.</p>
        `
    }
];

