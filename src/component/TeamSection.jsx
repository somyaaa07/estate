/**
 * Team section restyled to match the "Board of Directors" reference:
 *  - centred navy card for the top person (founder)
 *  - two columns of light cards with round avatars
 *  - orange connector line that runs from the top card, curves down on both
 *    sides, passes behind the avatars and joins at the bottom (desktop only)
 *
 * Props: `founder`, `teamMembers` and `TeamPhoto` (pass them in from the file
 * where they are defined):
 *   <TeamSection founder={founder} teamMembers={teamMembers} TeamPhoto={TeamPhoto} />
 * Optional fonts (add to your <head> / layout):
 *   Marcellus (heading) + Montserrat (cards) from Google Fonts.
 */

function MemberCard({ member, TeamPhoto }) {
  return (
    <li className="relative z-10 flex min-h-[110px] items-center gap-6 rounded-xl bg-[#FBFAFF] px-9 py-4">
      <div className="relative h-[85px] w-[85px] shrink-0 overflow-hidden rounded-full bg-[#E5E7EB]">
        <TeamPhoto
          name={member.name}
          photo={member.photo}
          sizes="85px"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="min-w-0">
        <h3 className="font-['Montserrat',sans-serif] text-[15px] font-semibold leading-snug text-[#F07F2D]">
          {member.name}
        </h3>
        <p className="mt-1 font-['Montserrat',sans-serif] text-[13.5px] italic leading-snug text-[#3B73B9]">
          {member.role}
        </p>
      </div>
    </li>
  );
}

export default function TeamSection({ founder, teamMembers = [], TeamPhoto }) {
  // split the members into a left and a right column
  const half = Math.ceil(teamMembers.length / 2);
  const leftColumn = teamMembers.slice(0, half);
  const rightColumn = teamMembers.slice(half);

  return (
    <section
      id="team"
      aria-labelledby="team-title"
      className="bg-white"
    >
      <div className="mx-auto max-w-[1000px] px-5 py-16 sm:px-8 lg:py-20">
        <h2
          id="team-title"
          className="text-center font-['Marcellus',serif] text-4xl font-normal text-[#0B1F4A] sm:text-5xl"
        >
          The People Behind Bringo
        </h2>

        <div className="relative mt-10">
          {/* Orange connector (desktop only). Sits behind the cards. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-[7px] left-[78px] right-[calc(40%-78px)] top-[55px] hidden rounded-t-[40px] border border-[#E8914F] lg:block"
          />

          {/* Founder / chairman */}
          <article className="relative z-10 mx-auto flex min-h-[110px] items-center gap-6 rounded-xl bg-[#1E3D73] px-9 py-4 lg:w-[40%]">
            <div className="relative h-[85px] w-[85px] shrink-0 overflow-hidden rounded-full bg-[#E5E7EB]">
              <TeamPhoto
                name={founder.name}
                photo={founder.photo}
                sizes="85px"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <h3 className="font-['Montserrat',sans-serif] text-[15px] font-bold leading-snug text-white">
                {founder.name}
              </h3>
              <p className="mt-1 font-['Montserrat',sans-serif] text-[13.5px] italic leading-snug text-white">
                {founder.role}
              </p>
            </div>
          </article>

          {/* Two columns of members */}
          <div className="mt-6 grid gap-6 lg:grid-cols-2 lg:gap-x-[20%]">
            <ul className="flex flex-col gap-6">
              {leftColumn.map((member) => (
                <MemberCard key={member.name} member={member} TeamPhoto={TeamPhoto} />
              ))}
            </ul>
            <ul className="flex flex-col gap-6">
              {rightColumn.map((member) => (
                <MemberCard key={member.name} member={member} TeamPhoto={TeamPhoto} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}