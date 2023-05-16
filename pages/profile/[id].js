import Profile from '../../components/profile';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { HatterContext } from '../HatterContext';
import { KozepContext } from '../KozepContext';
import { AfterContext } from '../AfterContext';

function ProfileID() {

    const router = useRouter();

    const { id } = router.query;

    const { tarthatter, setTarthatter } = useContext(HatterContext);
    const { tartkozep, setTartkozep } = useContext(KozepContext);
    const { after, setAfter } = useContext(AfterContext);

    useEffect(() => {
      setTarthatter(0);
      setTartkozep(0);
      setAfter(0);
    }, [setTarthatter, setTartkozep, setAfter]);

    return (
        <> 
          <Profile getID={id} />
        </>
    )
}

export default ProfileID;