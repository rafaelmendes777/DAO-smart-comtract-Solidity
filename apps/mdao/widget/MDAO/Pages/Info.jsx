let { assets, content } = VM.require(`/*__@replace:widgetPath__*/.Config`);

assets = assets.home;
content = content.home;

const Container = styled.div`
  position: relative;
  width: 100%;
  height: max-content;
  overflow: hidden;
`;

const InfoSection = styled.div`
  width: 75%;
  padding: 5rem 3rem;
  font-weight: 300;
  font-size: 1.2rem;

  h1 {
    font-size: 3rem;
    font-weight: 600;
  }

  @media screen and (max-width: 786px) {
    width: 100%;
    padding: 2rem 1rem;
  }
`;

const communities = [
  {
    title: "Community Name",
    desc: "We believe that communities are the foundation of a decentralized ecosystem. Explore and engage with our diverse range of communities today.",
    href: "",
  },
  {
    title: "Community Name",
    desc: "We believe that communities are the foundation of a decentralized ecosystem. Explore and engage with our diverse range of communities today.",
    href: "",
  },
  {
    title: "Community Name",
    desc: "We believe that communities are the foundation of a decentralized ecosystem. Explore and engage with our diverse range of communities today.",
    href: "",
  },
];

return (
  <Container>
    <InfoSection className="d-flex flex-column gap-4 mx-auto">
      <div>
        <h1>NDC & MDAO social media strategy</h1>
        <p>
          The objective is to align NDC Social Media with NF Marketing,
          Ecosystem and MDAO goals.
        </p>
      </div>
      <div>
        <h2>MDAO vision</h2>
        <p>
          MDAO’s vision is aligned with NDC Core Values, as outlined by the CoA
          for V1.
        </p>
        I. Empowering the Ecosystem (for the people, by the people)
        <ul>
          <li>
            Attraction of renowned influencers from outside the ecosystem.
          </li>
          <li>Collaboration with famous media outlets through PR agencies.</li>
          <li>
            Support for existing ecosystem influencers (NEKO Layer One, NEAR
            Insider).
          </li>
          <li>Implementation of NDC marketing strategy and content plan.</li>
          <li>Support for ECOsystem founders (form for NF ECO team).</li>
        </ul>
        II. Respected by the Ecosystem (fair, accountable, transparent, and
        reliable)
        <ul>
          <li>
            Comprehensive support for ecosystem projects in marketing, including
            consultations (mentorship) and strategy development.
          </li>
          <li>
            Weekly/monthly workshops with marketing experts for ECOsystem
            partners (focused on building marketing strategies, etc.).
          </li>
        </ul>
      </div>
      <div className="text-center mx-auto">
        <img
          className="rounded"
          src="https://ipfs.near.social/ipfs/bafkreigefydwv6a4qbydghcgatvok4wqubyc7zechti2n7h4bmhxdmrjiy"
        />
      </div>
      <div>
        III. Dedicated to the Ideas of Decentralization (antifragile, scalable,
        with collective decision making)
        <ul>
          <li>
            Unification of marketing activities for grassroots recipients in
            different routes, including consultations and strategy
            development/mentorship.
          </li>
        </ul>
      </div>
      <div className="text-center mx-auto">
        <img
          className="rounded"
          src="https://ipfs.near.social/ipfs/bafkreiek3sxtt7dapoialejd5mi3u3hwiailaeybdvzy5e6m7g6vc7ts3i"
        />
      </div>
      <div>
        IV. Efficient Operation (don’t be a burden, instead help the community
        to be more efficient)
        <ul>
          <li>Goal: Fast and efficient payments and resolutions.</li>
        </ul>
        V. Continuous Improvement via Weekly Iterations (plan ahead, measure
        results, and adjust continuously)
        <ul>
          <li>Creation of an NDC dashboard (MDAO part).</li>
        </ul>
      </div>
      <div>
        <h2>Metrics</h2>
        <p>
          Metrics are crucial for measuring progress and ensuring collective
          accountability. Common dashboards will be developed for transparency,
          tracking individual initiative performance, and overall NDC
          performance. All metrics must be attributable to the relevant
          project/initiative through on-chain activity and off-chain reporting,
          ensuring GDPR compliance and preserving privacy.
        </p>
        <ol>
          <li>
            Accounts retention after 1/2/4/8 weeks — the percentage of accounts
            that continue interacting on-chain over a given time period (higher
            is better).
          </li>
          <li>
            Account acquisition cost — budget divided by the number of accounts
            interacting through the funded initiative (lower is better).
          </li>
          <li>
            Median number of dApps used by P95 accounts retained for 1+ week
            (higher is better).
          </li>
          <li>
            Number of accounts retained for 1+ week using at least 3 dApps
            (higher is better).
          </li>
          <li>
            Social engagement score — a compound metric of the number of posts,
            likes, and followers/views in social media produced by users.
          </li>
        </ol>
        <div className="text-center mx-auto">
          <img
            className="rounded"
            src="https://ipfs.near.social/ipfs/bafkreifuar4dj7z5ab2mcpednrtaoowb2vwb4ogiuml4kaglbvjtljoczy"
          />
        </div>
      </div>
      <div>
        <h2>MDAO Scope</h2>
        <h4>P-1: Widening Adoption of NEAR</h4>
        <h5>P-1.1: Outreach to New Audiences</h5>
        <p>
          Continuous engagement with diverse audiences serves as a cornerstone
          for attracting new community members and fostering innovative ideas.
        </p>
        <ol>
          <li>
            <b>Collaboration with Top Influencers</b>: Establishment of
            partnerships with influential figures to amplify outreach efforts.
          </li>
          <li>
            <b>AMAs and Demonstrations</b>: Conducting engaging AMAs and Near
            demonstrations tailored for both blockchain and non-blockchain
            communities.
          </li>
          <li>
            Topics encompass various domains such as Traditional Finance apps
            exploring exposure to DeFi yield, Traditional software companies
            aiming to leverage blockchain for enhanced security, AI/ML data
            provenance, and Social apps with stringent data privacy requirements
            and potential network effects.
          </li>
          <li>Integration of Congress participation to enhance visibility.</li>
          <li>
            <b>Engagement with Top Media Publications</b>: Strategic engagement
            with prominent media outlets to elevate the visibility of NDC
            initiatives.
          </li>
          <li>
            <b>Referral Systems</b>: Implementation of robust referral systems
            in collaboration with ShareDog and other platforms to encourage
            ecosystem growth.
          </li>
          <li>
            <b>Time-Bound Events</b>: Organizing themed events such as
            “NEARtober Fest” and “NEAR Advent Calendar” to create time-sensitive
            engagement opportunities.
          </li>
          <li>
            <b>Bounties for Ecosystem Participation</b>: Introduction of bounty
            programs to incentivize and reward active participation within the
            ecosystem.
          </li>
        </ol>
        <p>
          These initiatives collectively contribute to the Marketing DAO and NDC
          media strategy, fostering community growth and ensuring continuous
          engagement.
        </p>
      </div>
      <div className="text-center mx-auto">
        <img
          className="rounded"
          src="https://ipfs.near.social/ipfs/bafkreiam74ytdhyu6kztj4gwtmdah7ojkmicuvpo3k6ductpamu7wi2aca"
        />
      </div>
      <div>
        <h2>Calls to Actions</h2>
        <ol>
          <li>
            MDAO’s contributors should be on the same page with NDC media
            strategy.
          </li>
          <li>MDAO’s contributors’ content should cover NDC content-plan.</li>
          <li>
            Synchronize NDC and MDAO social media activities/content with NF,
            NDC (incl.Grassroots) and Ecosystem projects.
          </li>
          <li>
            Hire a PR agency to promote NDC, Eco and NDC/Community news outside
            the NEAR Ecosystem.
          </li>
        </ol>
      </div>
      <div className="text-center mx-auto">
        <img
          className="rounded"
          src="https://ipfs.near.social/ipfs/bafkreiablexci4tlhyyq7tgagbg2ccfhxaej4mmfoy6t6b76m4o5brs444"
        />
      </div>
      <div>
        <h2>Implementation steps</h2>
        <ol>
          <li>
            To propose on the forum a series of Bounties for each news
            direction/topic The idea is to have someone(project,
            content-creator) who covers every topic on a regular basis.
            <ul>
              <li>
                NEAR Ecosystem projects’ social media support (support ecosystem
                projects and their marketing activities to promote their updates
                and attract new on-chain audiences to dApps on NEAR);
              </li>
              <li>
                Grassroots DAOs highlights (engage ecosystem media to create
                more explanatory content about NDC Grassroots DAOs’ activities
                and disseminate it beyond the NEAR ecosystem);
              </li>
              <li>
                NDC Congress and Operations It can be Content-creator(s)
                ‘Reporter’, who constantly searches updates from
                projects/DAOs/members in each direction(topic) and creates
                threads/podcasts/AMAs around these Ecosystem/NDC/DAOs updates
              </li>
              <li>
                Community engagement events (organization of monthly engagement
                events on Zealy or NearTasks platforms for/about grassroots and
                ecosystem projects’ communities);{" "}
              </li>
              <li>
                Review proposals to define the best candidates for the mentioned
                roles above, comment on and approve certain proposals, and give
                necessary mentorship to the teams
              </li>
            </ul>
          </li>
          <li>
            Increase Web3-influencers awareness with the establishment of Media
            Partnerships attract influencers from outside the ecosystem (monthly
            engagement activities for them on behalf of MDAO or from grantees)
            AMAs with key NDC Congress representatives AMAs with big/medium
            web3-influencers
          </li>
          <li>
            Collect a list of Ecosystem projects, regional communities and
            WG/Grassroot DAOs’ communities chats (started, in progress)
          </li>
          <li>
            NDC news stream channel and chat development (for now it’s just set
            up)
          </li>
          <li> PR agency set up </li>
          <li>Update Official MDAO Grant Requirement with the point</li>
        </ol>
        <p>
          All recipients of MDAO grants are mandated to display the MDAO and
          NEAR logos on all events and activities associated with the granted
          project. This logo inclusion is a formal requirement to ensure proper
          acknowledgment and representation of MDAO support. Grantees are
          expected to adhere to this guideline as part of their commitment to
          the terms and conditions of the MDAO grant agreement. This practice
          serves to enhance visibility, promote transparency, and acknowledge
          the collaborative efforts between MDAO and the grantee.
        </p>
      </div>
    </InfoSection>
  </Container>
);
